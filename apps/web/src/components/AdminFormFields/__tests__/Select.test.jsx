import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '../Select';

describe('Select Component', () => {
  const options = ['Option 1', 'Option 2', 'Option 3'];
  const objectOptions = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' }
  ];

  it('renders label and select field', () => {
    render(
      <Select 
        label="Status" 
        name="status" 
        value="" 
        onChange={() => {}} 
        options={options}
      />
    );
    
    expect(screen.getByLabelText('Status')).toBeDefined();
    expect(screen.getByRole('combobox')).toBeDefined();
  });

  it('displays all options from string array', () => {
    render(
      <Select 
        label="Status" 
        name="status" 
        value="" 
        onChange={() => {}} 
        options={options}
      />
    );
    
    expect(screen.getByText('Option 1')).toBeDefined();
    expect(screen.getByText('Option 2')).toBeDefined();
    expect(screen.getByText('Option 3')).toBeDefined();
  });

  it('displays all options from object array', () => {
    render(
      <Select 
        label="Status" 
        name="status" 
        value="" 
        onChange={() => {}} 
        options={objectOptions}
      />
    );
    
    expect(screen.getByText('Option 1')).toBeDefined();
    expect(screen.getByText('Option 2')).toBeDefined();
    expect(screen.getByText('Option 3')).toBeDefined();
  });

  it('displays the selected value', () => {
    render(
      <Select 
        label="Status" 
        name="status" 
        value="Option 2" 
        onChange={() => {}} 
        options={options}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('Option 2');
  });

  it('calls onChange when selection changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <Select 
        label="Status" 
        name="status" 
        value="" 
        onChange={handleChange} 
        options={options}
      />
    );
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'Option 2');
    
    expect(handleChange).toHaveBeenCalledWith('Option 2', 'status');
  });

  it('displays required indicator when required prop is true', () => {
    render(
      <Select 
        label="Status" 
        name="status" 
        value="" 
        onChange={() => {}} 
        options={options}
        required={true}
      />
    );
    
    expect(screen.getByText('*')).toBeDefined();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <Select 
        label="Status" 
        name="status" 
        value="" 
        onChange={() => {}} 
        options={options}
        error="Please select a status"
      />
    );
    
    expect(screen.getByText('Please select a status')).toBeDefined();
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('disables select when disabled prop is true', () => {
    render(
      <Select 
        label="Status" 
        name="status" 
        value="" 
        onChange={() => {}} 
        options={options}
        disabled={true}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select.disabled).toBe(true);
  });

  it('displays placeholder option when provided', () => {
    render(
      <Select 
        label="Status" 
        name="status" 
        value="" 
        onChange={() => {}} 
        options={options}
        placeholder="Choose a status"
      />
    );
    
    expect(screen.getByText('Choose a status')).toBeDefined();
  });

  it('handles object options with value and label correctly', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <Select 
        label="Status" 
        name="status" 
        value="" 
        onChange={handleChange} 
        options={objectOptions}
      />
    );
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'opt2');
    
    expect(handleChange).toHaveBeenCalledWith('opt2', 'status');
  });
});
