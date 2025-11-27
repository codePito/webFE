import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
interface AdminLayoutProps {
  children: React.ReactNode;
}
export function AdminLayout({
  children
}: AdminLayoutProps) {
  return <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main className="ml-64 pt-16">
        <div className="p-6">{children}</div>
      </main>
    </div>;
}