import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from '@/components/EmptyState/EmptyState';

describe('EmptyState Component', () => {
  it('normal: should render empty state title', () => {
    render(<EmptyState />);
    expect(screen.getByText('No saved tabs')).toBeInTheDocument();
  });

  it('normal: should render description', () => {
    render(<EmptyState />);
    expect(screen.getByText(/Save Current/)).toBeInTheDocument();
  });

  it('normal: should render icon', () => {
    render(<EmptyState />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('normal: should match snapshot', () => {
    const { container } = render(<EmptyState />);
    expect(container).toMatchSnapshot();
  });
});
