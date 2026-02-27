import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextArea from '../TextArea';

describe('TextArea Component', () => {
  it('renders label and textarea field', () => {
    render(
      <TextArea 
        label="Description" 
        name="description" 
        value="" 
        onChange={() => {}} 
      />
    );
    
    expect(screen.getByLabelText('Description')).toBeDefined();
    expect(screen.getByRole('textbox')).toBeDefined();
  });

  it('displays the current value', () => {
    render(
      <TextArea 
        label="Description" 
        name="description" 
        value="test content" 
        onChange={() => {}} 
      />
    );
    
    const textarea = screen.getByRole('textbox');
    expect(textarea.value).toBe('test content');
  });

  it('calls onChange when textarea value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <TextArea 
        label="Description" 
        name="description" 
        value="" 
        onChange={handleChange} 
      />
    );
    
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'new content');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays required indicator when required prop is true', () => {
    render(
      <TextArea 
        label="Description" 
        name="description" 
        value="" 
        onChange={() => {}} 
        required={true}
      />
    );
    
    expect(screen.getByText('*')).toBeDefined();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <TextArea 
        label="Description" 
        name="description" 
        value="" 
        onChange={() => {}} 
        error="Description is required"
      />
    );
    
    expect(screen.getByText('Description is required')).toBeDefined();
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('displays character count when maxLength is provided', () => {
    render(
      <TextArea 
        label="Description" 
        name="description" 
        value="hello world" 
        onChange={() => {}} 
        maxLength={200}
      />
    );
    
    expect(screen.getByText('11/200')).toBeDefined();
  });

  it('disables textarea when disabled prop is true', () => {
    render(
      <TextArea 
        label="Description" 
        name="description" 
        value="" 
        onChange={() => {}} 
        disabled={true}
      />
    );
    
    const textarea = screen.getByRole('textbox');
    expect(textarea.disabled).toBe(true);
  });

  it('applies custom rows attribute', () => {
    render(
      <TextArea 
        label="Description" 
        name="description" 
        value="" 
        onChange={() => {}} 
        rows={10}
      />
    );
    
    const textarea = screen.getByRole('textbox');
    expect(textarea.rows).toBe(10);
  });

  it('applies placeholder text', () => {
    render(
      <TextArea 
        label="Description" 
        name="description" 
        value="" 
        onChange={() => {}} 
        placeholder="Enter description here"
      />
    );
    
    const textarea = screen.getByPlaceholderText('Enter description here');
    expect(textarea).toBeDefined();
  });
});
