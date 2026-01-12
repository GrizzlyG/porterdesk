export function getDepartmentFromMatric(matric: string): string | null {
  if (!matric) return null;
  // Attempt to extract department from matric number (e.g. "COM/2024/001" -> "COM")
  const parts = matric.split('/');
  if (parts.length > 1) {
    return parts[0];
  }
  return null;
}