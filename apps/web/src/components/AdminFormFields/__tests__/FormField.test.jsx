import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormField from '../FormField';

describe('FormField Component', () => {
  it('renders label and input field', () => {
    render(
      <FormField 
        label="Test Field" 
        name="testField" 
        value="" 
        onChange={() => {}} 
      />
    );
    
    expect(screen.getByLabelText('Test Field')).toBeDefined();
    expect(screen.getByRole('textbox')).toBeDefined();
  });

  it('displays the current value', () => {
    render(
      <FormField 
        label="Test Field" 
        name="testField" 
        value="test value" 
        onChange={() => {}} 
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input.value).toBe('test value');
  });

  it('calls onChange when input value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <FormField 
        label="Test Field" 
        name="testField" 
        value="" 
        onChange={handleChange} 
      />
    );
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'new value');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays required indicator when required prop is true', () => {
    render(
      <FormField 
        label="Test Field" 
        name="testField" 
        value="" 
        onChange={() => {}} 
        required={true}
      />
    );
    
    expect(screen.getByText('*')).toBeDefined();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <FormField 
        label="Test Field" 
        name="testField" 
        value="" 
        onChange={() => {}} 
        error="This field is required"
      />
    );
    
    expect(screen.getByText('This field is required')).toBeDefined();
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('displays character count when maxLength is provided', () => {
    render(
      <FormField 
        label="Test Field" 
        name="testField" 
        value="hello" 
        onChange={() => {}} 
        maxLength={100}
      />
    );
    
    expect(screen.getByText('5/100')).toBeDefined();
  });

  it('disables input when disabled prop is true', () => {
    render(
      <FormField 
        label="Test Field" 
        name="testField" 
        value="" 
        onChange={() => {}} 
        disabled={true}
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input.disabled).toBe(true);
  });

  it('applies placeholder text', () => {
    render(
      <FormField 
        label="Test Field" 
        name="testField" 
        value="" 
        onChange={() => {}} 
        placeholder="Enter text here"
      />
    );
    
    const input = screen.getByPlaceholderText('Enter text here');
    expect(input).toBeDefined();
  });

  it('supports different input types', () => {
    render(
      <FormField 
        label="Email Field" 
        name="email" 
        value="" 
        onChange={() => {}} 
        type="email"
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input.type).toBe('email');
  });
});
