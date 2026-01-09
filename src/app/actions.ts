'use server';

import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const role = formData.get('role');

  console.log('Attempting to log in...', { email, role });

  // In a real application, you would validate credentials against a database (e.g., Firebase Auth).
  // For this mock, we'll just check if email and password are not empty.
  if (!email || !password) {
    return { message: 'Please enter both email and password.' };
  }

  // Simulate a successful login and redirect to the dashboard.
  redirect('/dashboard');
}

export async function logout() {
  // In a real application, you would sign the user out from Firebase here.
  console.log('Logging out...');
  redirect('/login');
}
