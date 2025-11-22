'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';
import { Plus, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setProjects(data);
    }
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return '入金済み';
      case 'overdue':
        return '期限超過';
      default:
        return '未入金';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">案件管理</h1>
          <Link
            href="/projects/new"
            className="flex items-center rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            <Plus className="mr-2 h-5 w-5" />
            案件を追加
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-md">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">案件が登録されていません</p>
            <Link
              href="/projects/new"
              className="mt-4 inline-block rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            >
              最初の案件を追加
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.project_name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{project.client_name}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                      project.payment_status
                    )}`}
                  >
                    {getStatusLabel(project.payment_status)}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">単価:</span>
                    <span className="font-medium">¥{project.unit_price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">作業日:</span>
                    <span className="font-medium">{project.work_date}</span>
                  </div>
                  {project.payment_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">入金日:</span>
                      <span className="font-medium">{project.payment_date}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

