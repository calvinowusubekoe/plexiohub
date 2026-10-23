'use client';

import { ImagePlus, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { saveProject } from '@/app/admin/(protected)/actions';
import { SERVICES } from '@/config/services';
import { projectFormErrors, slugify, validateImageFile, type ProjectFormErrors } from '@/lib/admin/projectForm';
import type { Project } from '@/lib/data/projects';
import { createBrowserClient } from '@/lib/supabase/browser';
import { btn, field as input, label as labelClass } from './ui';

async function uploadImage(file: File): Promise<string> {
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `projects/${crypto.randomUUID()}.${ext}`;
  const storage = createBrowserClient().storage.from('project-images');
  const { error } = await storage.upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return storage.getPublicUrl(path).data.publicUrl;
}

function Err({ message }: { message?: string }) {
  return message ? <p className="mt-1.5 text-sm font-medium text-red-700">{message}</p> : null;
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-b border-line py-8 first:pt-0 lg:grid-cols-[15rem_1fr] lg:gap-10">
      <div>
        <h2 className="font-semibold text-navy">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{description}</p>
      </div>
      <div className="space-y-5 rounded-xl border border-line bg-white p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Dropzone({ id, label, hint, multiple, onFiles }: { id: string; label: string; hint: string; multiple?: boolean; onFiles: (f: FileList | null) => void }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line bg-surface px-4 py-6 text-center transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 hover:border-brand"
    >
      <ImagePlus className="h-6 w-6 text-brand" strokeWidth={1.75} aria-hidden />
      <span className="text-sm font-semibold text-navy">{label}</span>
      <span className="text-xs text-ink-muted">{hint}</span>
      <input id={id} type="file" multiple={multiple} accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => onFiles(e.target.files)} />
    </label>
  );
}

const optionCard = (checked: boolean) =>
  `flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm font-medium text-navy transition-colors ${
    checked ? 'border-brand bg-blue-50/60' : 'border-line bg-white hover:border-navy/30'
  }`;

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [title, setTitle] = useState(project?.title ?? '');
  const [slug, setSlug] = useState(project?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(Boolean(project));
  const [kind, setKind] = useState<'client' | 'concept'>(project?.kind ?? 'client');
  const [summary, setSummary] = useState(project?.summary ?? '');
  const [tags, setTags] = useState<string[]>(project?.serviceTags ?? []);
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? '');
  const [cover, setCover] = useState(project?.coverImageUrl ?? '');
  const [gallery, setGallery] = useState<string[]>(project?.galleryUrls ?? []);
  const [errors, setErrors] = useState<ProjectFormErrors>({});
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [pending, start] = useTransition();

  async function onFiles(files: FileList | null, target: 'cover' | 'gallery') {
    if (!files?.length) return;
    const list = Array.from(files);
    const problem = list.map(validateImageFile).find(Boolean);
    if (problem) {
      setErrors((e) => ({ ...e, images: problem }));
      return;
    }
    setErrors((e) => ({ ...e, images: undefined }));
    setUploading(true);
    try {
      const urls = await Promise.all(list.map(uploadImage));
      if (target === 'cover') setCover(urls[0]);
      else setGallery((g) => [...g, ...urls]);
    } catch {
      setErrors((e) => ({ ...e, images: 'Upload failed. Please try again.' }));
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = projectFormErrors({ title, slug, summary, serviceTags: tags, liveUrl });
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length) return;
    const form = new FormData(e.currentTarget);
    start(async () => {
      const result = await saveProject(form);
      if (result.ok) {
        router.push('/admin/projects');
        router.refresh();
      } else {
        setFormError(result.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="sortOrder" value={project?.sortOrder ?? 0} />
      <input type="hidden" name="coverImageUrl" value={cover} />
      <input type="hidden" name="galleryUrls" value={JSON.stringify(gallery)} />

      <Section title="Basics" description="The name, web address and which services this project shows off.">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input
              id="title"
              name="title"
              className={input}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugEdited) setSlug(slugify(e.target.value));
              }}
            />
            <Err message={errors.title} />
          </div>
          <div>
            <label htmlFor="slug" className={labelClass}>
              URL name (plexiohub.com/work/…)
            </label>
            <input
              id="slug"
              name="slug"
              className={input}
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
            />
            <Err message={errors.slug} />
          </div>
        </div>

        <fieldset>
          <legend className={labelClass}>Type</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <label className={optionCard(kind === 'client')}>
              <input type="radio" name="kind" value="client" checked={kind === 'client'} onChange={() => setKind('client')} className="accent-brand" />
              Client project
            </label>
            <label className={optionCard(kind === 'concept')}>
              <input type="radio" name="kind" value="concept" checked={kind === 'concept'} onChange={() => setKind('concept')} className="accent-brand" />
              Concept / demo
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>Services</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <label key={s.slug} className={optionCard(tags.includes(s.slug))}>
                <input
                  type="checkbox"
                  name="serviceTags"
                  value={s.slug}
                  checked={tags.includes(s.slug)}
                  onChange={(e) => setTags((t) => (e.target.checked ? [...t, s.slug] : t.filter((x) => x !== s.slug)))}
                  className="accent-brand"
                />
                {s.name}
              </label>
            ))}
          </div>
          <Err message={errors.serviceTags} />
        </fieldset>
      </Section>

      <Section title="Story" description="What visitors read on the project page. Focus on the client's problem and the result.">
        <div>
          <label htmlFor="summary" className={labelClass}>
            Summary
          </label>
          <input
            id="summary"
            name="summary"
            maxLength={200}
            className={input}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="One line: what this project is"
          />
          <Err message={errors.summary} />
        </div>
        <div>
          <label htmlFor="problem" className={labelClass}>
            Problem it solves
          </label>
          <textarea id="problem" name="problem" rows={3} className={input} defaultValue={project?.problem} />
        </div>
        <div>
          <label htmlFor="built" className={labelClass}>
            What we built
          </label>
          <textarea id="built" name="built" rows={3} className={input} defaultValue={project?.built} />
        </div>
        <div>
          <label htmlFor="features" className={labelClass}>
            Key features
          </label>
          <p className="text-xs text-ink-muted">One per line.</p>
          <textarea id="features" name="features" rows={4} className={input} defaultValue={project?.features.join('\n')} />
        </div>
        <div>
          <label htmlFor="liveUrl" className={labelClass}>
            Live website (optional)
          </label>
          <input
            id="liveUrl"
            name="liveUrl"
            type="url"
            className={input}
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://"
          />
          <Err message={errors.liveUrl} />
        </div>
      </Section>

      <Section title="Images" description="A cover image for the card, plus any extra screenshots for the project page.">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className={labelClass}>Cover image</p>
            <div className="mt-1.5">
              {cover ? (
                <div className="relative overflow-hidden rounded-lg border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt="Cover preview" className="aspect-[16/10] w-full object-cover object-top" />
                  <button
                    type="button"
                    onClick={() => setCover('')}
                    className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-red-700 shadow"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden /> Remove
                  </button>
                </div>
              ) : (
                <Dropzone id="cover" label="Upload cover image" hint="JPG, PNG or WebP, up to 5 MB" onFiles={(f) => onFiles(f, 'cover')} />
              )}
            </div>
          </div>
          <div>
            <p className={labelClass}>More screenshots</p>
            <div className="mt-1.5 space-y-3">
              <Dropzone id="gallery" label="Add screenshots" hint="You can pick several at once" multiple onFiles={(f) => onFiles(f, 'gallery')} />
              {gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {gallery.map((url) => (
                    <div key={url} className="relative overflow-hidden rounded-md border border-line">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="aspect-[16/10] w-full object-cover" />
                      <button
                        type="button"
                        aria-label="Remove screenshot"
                        className="absolute right-1 top-1 rounded bg-white/95 p-0.5 text-red-700 shadow"
                        onClick={() => setGallery((g) => g.filter((u) => u !== url))}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <Err message={errors.images} />
        {uploading && <p className="text-sm text-ink-muted">Uploading…</p>}
      </Section>

      <Section title="Visibility" description="Hidden projects stay here in admin but don't appear on the website.">
        <label className="flex items-start gap-3">
          <input type="checkbox" name="published" defaultChecked={project?.published ?? true} className="mt-1 h-4 w-4 accent-brand" />
          <span>
            <span className="block font-semibold text-navy">Published</span>
            <span className="text-sm text-ink-muted">Show this project on the homepage and the Work page.</span>
          </span>
        </label>
      </Section>

      {formError && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
          {formError}
        </p>
      )}

      <div className="sticky bottom-0 -mx-4 mt-6 flex justify-end gap-2 border-t border-line bg-surface/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <Link href="/admin/projects" className={btn.secondary}>
          Cancel
        </Link>
        <button type="submit" disabled={pending || uploading} className={btn.primary}>
          {pending ? 'Saving…' : 'Save project'}
        </button>
      </div>
    </form>
  );
}
