'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { saveProject } from '@/app/admin/(protected)/actions';
import { SERVICES } from '@/config/services';
import { projectFormErrors, slugify, validateImageFile, type ProjectFormErrors } from '@/lib/admin/projectForm';
import type { Project } from '@/lib/data/projects';
import { createBrowserClient } from '@/lib/supabase/browser';

const input = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30';

async function uploadImage(file: File): Promise<string> {
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `projects/${crypto.randomUUID()}.${ext}`;
  const storage = createBrowserClient().storage.from('project-images');
  const { error } = await storage.upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return storage.getPublicUrl(path).data.publicUrl;
}

function Err({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-sm font-medium text-red-600">{message}</p> : null;
}

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [title, setTitle] = useState(project?.title ?? '');
  const [slug, setSlug] = useState(project?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(Boolean(project));
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
    <form onSubmit={onSubmit} noValidate className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="sortOrder" value={project?.sortOrder ?? 0} />
      <input type="hidden" name="coverImageUrl" value={cover} />
      <input type="hidden" name="galleryUrls" value={JSON.stringify(gallery)} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="text-sm font-medium">Title</label>
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
          <label htmlFor="slug" className="text-sm font-medium">URL name (plexiohub.com/work/…)</label>
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
        <legend className="text-sm font-medium">Type</legend>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2"><input type="radio" name="kind" value="client" defaultChecked={project?.kind !== 'concept'} /> Client project</label>
          <label className="flex items-center gap-2"><input type="radio" name="kind" value="concept" defaultChecked={project?.kind === 'concept'} /> Concept / demo</label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">Services</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <label key={s.slug} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="serviceTags"
                value={s.slug}
                checked={tags.includes(s.slug)}
                onChange={(e) => setTags((t) => (e.target.checked ? [...t, s.slug] : t.filter((x) => x !== s.slug)))}
              />
              {s.name}
            </label>
          ))}
        </div>
        <Err message={errors.serviceTags} />
      </fieldset>

      <div>
        <label htmlFor="summary" className="text-sm font-medium">Summary</label>
        <input id="summary" name="summary" maxLength={200} className={input} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="One line: what this project is" />
        <Err message={errors.summary} />
      </div>
      <div>
        <label htmlFor="problem" className="text-sm font-medium">Problem it solves</label>
        <textarea id="problem" name="problem" rows={3} className={input} defaultValue={project?.problem} />
      </div>
      <div>
        <label htmlFor="built" className="text-sm font-medium">What we built</label>
        <textarea id="built" name="built" rows={3} className={input} defaultValue={project?.built} />
      </div>
      <div>
        <label htmlFor="features" className="text-sm font-medium">Key features (one per line)</label>
        <textarea id="features" name="features" rows={4} className={input} defaultValue={project?.features.join('\n')} />
      </div>
      <div>
        <label htmlFor="liveUrl" className="text-sm font-medium">Live URL (optional)</label>
        <input id="liveUrl" name="liveUrl" type="url" className={input} value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://" />
        <Err message={errors.liveUrl} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cover" className="text-sm font-medium">Cover image (JPG, PNG or WebP, max 5 MB)</label>
          <input id="cover" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block text-sm" onChange={(e) => onFiles(e.target.files, 'cover')} />
          {cover && (
            <div className="mt-2 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt="Cover preview" className="h-16 w-24 rounded object-cover" />
              <button type="button" className="text-sm text-red-600" onClick={() => setCover('')}>Remove</button>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="gallery" className="text-sm font-medium">More screenshots</label>
          <input id="gallery" type="file" multiple accept="image/jpeg,image/png,image/webp" className="mt-2 block text-sm" onChange={(e) => onFiles(e.target.files, 'gallery')} />
          <div className="mt-2 flex flex-wrap gap-2">
            {gallery.map((url) => (
              <div key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-16 w-24 rounded object-cover" />
                <button type="button" aria-label="Remove screenshot" className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-600 text-xs text-white" onClick={() => setGallery((g) => g.filter((u) => u !== url))}>×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Err message={errors.images} />
      {uploading && <p className="text-sm text-navy/60">Uploading…</p>}

      <label className="flex items-center gap-2 font-medium">
        <input type="checkbox" name="published" defaultChecked={project?.published ?? true} /> Published (visible on the website)
      </label>

      {formError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{formError}</p>}

      <button type="submit" disabled={pending || uploading} className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-70">
        {pending ? 'Saving…' : 'Save project'}
      </button>
    </form>
  );
}
