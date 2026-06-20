import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CarbonProvider } from '../context/CarbonContext';
import { AnnouncerProvider } from '../context/AnnouncerProvider';
import { useAnnouncer } from '../context/useAnnouncer';
import { SmartRecommendations } from '../components/SmartRecommendations';

beforeEach(() => {
  localStorage.clear();
});

function Announcer() {
  const announce = useAnnouncer();
  return <button onClick={() => announce('hello world')}>announce</button>;
}

describe('AnnouncerProvider', () => {
  it('renders an always-present polite live region', () => {
    render(<AnnouncerProvider><span>child</span></AnnouncerProvider>);
    const region = document.querySelector('[aria-live="polite"]');
    expect(region).not.toBeNull();
  });

  it('announces a message through the live region', () => {
    render(<AnnouncerProvider><Announcer /></AnnouncerProvider>);
    act(() => {
      fireEvent.click(screen.getByText('announce'));
    });
    expect(screen.getByText('hello world')).toBeDefined();
  });

  it('throws when useAnnouncer is used outside the provider', () => {
    function Bare() {
      useAnnouncer();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(/AnnouncerProvider/);
  });
});

describe('SmartRecommendations', () => {
  it('renders the recommendations heading', () => {
    render(
      <CarbonProvider>
        <SmartRecommendations />
      </CarbonProvider>,
    );
    expect(screen.getByText('Smart Recommendations')).toBeDefined();
  });

  it('shows the start recommendation when there is no data', () => {
    render(
      <CarbonProvider>
        <SmartRecommendations />
      </CarbonProvider>,
    );
    expect(screen.getByText(/Start tracking to unlock insights/)).toBeDefined();
  });
});
