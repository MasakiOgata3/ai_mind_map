describe('Sample Test Suite', () => {
  it('should perform basic math correctly', () => {
    expect(2 + 2).toBe(4);
  });

  it('should handle string concatenation', () => {
    const result = 'Hello' + ' ' + 'World';
    expect(result).toBe('Hello World');
  });

  it('should verify boolean values', () => {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
  });

  it('should check array operations', () => {
    const fruits = ['apple', 'banana', 'orange'];
    expect(fruits).toHaveLength(3);
    expect(fruits).toContain('banana');
  });
});