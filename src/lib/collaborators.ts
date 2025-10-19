import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Collaborator = {
  id: string;
  name: string;
  wallet: string;
  percentage?: number;
  role?: string | null;
};

export function useCollaborators() {
  return useQuery({
    queryKey: ['collaborators'],
    queryFn: async () => {
      const resp = await fetch('/api/collaborators');
      if (!resp.ok) throw new Error('Failed to load collaborators');
      return (await resp.json()) as { collaborators: Collaborator[] };
    }
  });
}

export function useAddCollaborator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Omit<Collaborator, 'id'>) => {
      const resp = await fetch('/api/collaborators', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!resp.ok) throw new Error('Failed to add collaborator');
      return resp.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collaborators'] }),
  });
}

export function useUpdateCollaborator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Collaborator> }) => {
      const resp = await fetch(`/api/collaborators/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
      if (!resp.ok) throw new Error('Failed to update collaborator');
      return resp.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collaborators'] }),
  });
}

export function useDeleteCollaborator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const resp = await fetch(`/api/collaborators/${id}`, { method: 'DELETE' });
      if (!resp.ok) throw new Error('Failed to delete collaborator');
      return resp.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collaborators'] }),
  });
}
