import { Student } from '../types/exam';

export const REGISTERED_STUDENTS: Student[] = [
  { id: 'SBA-C1-SNA-2026-001', name: 'Muhd Arab Lamido', email: 'muhdarablamido@gmail.com' },
  { id: 'SBA-C1-SNA-2026-002', name: 'Adamu Muhammad Gidado', email: 'gidadoadamu3@gmail.com' },
  { id: 'SBA-C1-SNA-2026-003', name: 'Ahmad Musa Ahmad', email: 'comradeahmadmusaimam@gmail.com' },
  { id: 'SBA-C1-SNA-2026-004', name: 'Abdurrashid Abdullahi Sani', email: 'saniabdurrashid2838@gmail.com' },
  { id: 'SBA-C1-SNA-2026-005', name: 'Aliyu Isah Baba', email: 'aliyuisahbaba2018@gmail.com' },
  { id: 'SBA-C1-SNA-2026-006', name: 'Oche Perfect Ikwulono', email: 'ocheperfect@outlook.com' },
  { id: 'SBA-C1-SNA-2026-007', name: 'Adamu Abdullahi', email: '' },
  { id: 'SBA-C1-SNA-2026-008', name: 'Halim Adinoyi Abdullahi', email: 'halimadinoyi@gmail.com' },
  { id: 'SBA-C1-SNA-2026-009', name: 'Mukhtar Ibrahim', email: 'mukhtaribro@gmail.com' },
  { id: 'SBA-C1-SNA-2026-010', name: 'Muhammad Salisu', email: 'mohsalis99@gmail.com' },
  { id: 'SBA-C1-SNA-2026-011', name: 'Abdulrahman Salihi Suleiman', email: 'asaleehi@gmail.com' },
  { id: 'SBA-C1-SNA-2026-012', name: 'Abdullahi Said Abdulkadir', email: 'mujaysaid@gmail.com' },
];

/**
 * Validates login input against registered students.
 * Matches either Student ID (exact match, case-insensitive)
 * OR Full Name (exact match after trim, case-insensitive).
 */
export function findStudent(input: string): Student | null {
  if (!input) return null;
  const cleaned = input.trim().toLowerCase();
  if (!cleaned) return null;

  return (
    REGISTERED_STUDENTS.find(
      (s) =>
        s.id.toLowerCase() === cleaned ||
        s.name.trim().toLowerCase() === cleaned
    ) || null
  );
}
