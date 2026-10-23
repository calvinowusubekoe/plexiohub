import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuoteWizard } from './QuoteWizard';
import { parseServiceParam } from './parseServiceParam';

type User = ReturnType<typeof userEvent.setup>;

const fetchMock = vi.fn();
const trackMock = vi.fn();

beforeEach(() => {
  sessionStorage.clear();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  trackMock.mockReset();
  window.umami = { track: trackMock };
});
afterEach(() => vi.unstubAllGlobals());

const next = (user: User) => user.click(screen.getByRole('button', { name: 'Next' }));

async function fillToStep4(user: User) {
  render(<QuoteWizard initialServices={['website-design']} />);
  await next(user);
  await user.type(screen.getByLabelText(/what do you want this to achieve/i), 'More customers');
  await next(user);
  await user.selectOptions(screen.getByLabelText('Budget range'), 'GHS 1,000–3,000');
  await user.selectOptions(screen.getByLabelText('Timeline'), 'Within 1 month');
  await next(user);
  await user.type(screen.getByLabelText('Your name'), 'Ama Mensah');
  await user.type(screen.getByLabelText('WhatsApp number'), '024 123 4567');
  await user.click(screen.getByRole('checkbox', { name: /agree/i }));
}

describe('parseServiceParam', () => {
  it('keeps only valid slugs from a comma list', () => {
    expect(parseServiceParam('hacking,ecommerce')).toEqual(['ecommerce']);
    expect(parseServiceParam(undefined)).toEqual([]);
    expect(parseServiceParam(['graphic-design'])).toEqual(['graphic-design']);
  });
});

describe('QuoteWizard', () => {
  it('pre-checks the service from the link', () => {
    render(<QuoteWizard initialServices={['graphic-design']} />);
    expect(screen.getByRole('checkbox', { name: /Graphic Design/ })).toBeChecked();
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
  });

  it('stays on step 1 with an error when nothing is selected', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard />);
    await next(user);
    expect(screen.getByText('Please choose at least one service.')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
  });

  it('shows the questions of every selected service on step 2', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard initialServices={['website-design', 'whatsapp-chatbots']} />);
    await next(user);
    expect(screen.getByText('Is this a new website or a redesign?')).toBeInTheDocument();
    expect(screen.getByText('Roughly how many customer messages do you get a day?')).toBeInTheDocument();
    expect(trackMock).toHaveBeenCalledWith('quote_started', undefined);
  });

  it('swaps budget options when switching to USD and clears the choice', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard initialServices={['ecommerce']} />);
    await next(user);
    await next(user);
    await user.selectOptions(screen.getByLabelText('Budget range'), 'GHS 3,000–7,000');
    await user.click(screen.getByRole('radio', { name: /USD/ }));
    const select = screen.getByLabelText('Budget range') as HTMLSelectElement;
    expect(select.value).toBe('');
    expect(screen.getByRole('option', { name: '$300–700' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'GHS 3,000–7,000' })).not.toBeInTheDocument();
  });

  it('requires a WhatsApp number or email on step 4', async () => {
    const user = userEvent.setup();
    await fillToStep4(user);
    await user.clear(screen.getByLabelText('WhatsApp number'));
    await user.click(screen.getByRole('button', { name: 'Send request' }));
    expect(screen.getByText('Please give a WhatsApp number or an email so we can reply.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('links the consent line to the privacy policy and requires it', async () => {
    const user = userEvent.setup();
    await fillToStep4(user);
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
    await user.click(screen.getByRole('checkbox', { name: /agree/i }));
    await user.click(screen.getByRole('button', { name: 'Send request' }));
    expect(screen.getByText('Please agree so we can contact you about your project.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('disables submit while sending', async () => {
    let resolve!: (r: Response) => void;
    fetchMock.mockReturnValue(new Promise<Response>((r) => (resolve = r)));
    const user = userEvent.setup();
    await fillToStep4(user);
    const button = screen.getByRole('button', { name: 'Send request' });
    await user.click(button);
    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Sending…' }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    await screen.findByText("Thanks, we'll get back to you within 24 hours");
  });

  it('shows the thank-you screen and tracks on success', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const user = userEvent.setup();
    await fillToStep4(user);
    await user.click(screen.getByRole('button', { name: 'Send request' }));
    expect(await screen.findByText("Thanks, we'll get back to you within 24 hours")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument();
    expect(trackMock).toHaveBeenCalledWith('quote_submitted', { services: 'website-design' });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({ services: ['website-design'], name: 'Ama Mensah', consent: true, budgetRange: 'GHS 1,000–3,000' });
    expect(sessionStorage.getItem('plexiohub-quote-draft')).toBeNull();
  });

  it('offers WhatsApp and keeps the data when saving fails', async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ ok: false, reason: 'not_saved' }), { status: 503 }));
    const user = userEvent.setup();
    await fillToStep4(user);
    await user.click(screen.getByRole('button', { name: 'Send request' }));
    expect(await screen.findByText(/may not have reached us/i)).toBeInTheDocument();
    const wa = screen.getByRole('link', { name: /send on whatsapp/i });
    const text = decodeURIComponent(wa.getAttribute('href') ?? '');
    expect(text).toContain('Ama Mensah');
    expect(text).toContain('Website Design & Development');
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText("Thanks, we'll get back to you within 24 hours")).toBeInTheDocument();
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).name).toBe('Ama Mensah');
  });

  it('moves focus to the result message so phone users see it', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const user = userEvent.setup();
    await fillToStep4(user);
    await user.click(screen.getByRole('button', { name: 'Send request' }));
    const heading = await screen.findByRole('heading', { name: "Thanks, we'll get back to you within 24 hours" });
    await waitFor(() => expect(heading).toHaveFocus());
  });

  it('treats a network error like a failed save', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    const user = userEvent.setup();
    await fillToStep4(user);
    await user.click(screen.getByRole('button', { name: 'Send request' }));
    expect(await screen.findByText(/may not have reached us/i)).toBeInTheDocument();
  });

  it('explains rate limiting', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: false, reason: 'rate_limited' }), { status: 429 }));
    const user = userEvent.setup();
    await fillToStep4(user);
    await user.click(screen.getByRole('button', { name: 'Send request' }));
    expect(await screen.findByText("You've sent several requests recently. Please contact us on WhatsApp.")).toBeInTheDocument();
  });

  it('renders a hidden honeypot field', () => {
    const { container } = render(<QuoteWizard />);
    const honeypot = container.querySelector('input[name="hp_x7"]') as HTMLInputElement;
    expect(container.querySelector('input[name*="company"]')).toBeNull();
    expect(honeypot).not.toBeNull();
    expect(honeypot.tabIndex).toBe(-1);
    expect(honeypot.getAttribute('autocomplete')).toBe('off');
  });

  it('restores a draft after a refresh', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<QuoteWizard initialServices={['it-support']} />);
    await next(user);
    await user.type(screen.getByLabelText(/what do you want this to achieve/i), 'Fix our Wi-Fi');
    unmount();
    render(<QuoteWizard />);
    await waitFor(() => expect(screen.getByRole('checkbox', { name: /IT & Tech Support/ })).toBeChecked());
  });
});
