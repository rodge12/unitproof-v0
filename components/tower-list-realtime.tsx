"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { TowerList } from "./tower-list";

type Tower = {
  name: string;
  vacantUnits: number;
};

async function fetchTowerData(supabase: ReturnType<typeof createClient>): Promise<Tower[]> {
  const { data, error } = await supabase
    .from("vacant_units")
    .select("tower_name, unit_no");
  if (error) {
    throw error;
  }
  // Group and count vacant units by tower_name
  const towerCounts = (data as { tower_name: string; unit_no: string }[]).reduce((acc, { tower_name }) => {
    acc[tower_name] = (acc[tower_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.entries(towerCounts).map(([name, vacantUnits]) => ({ name, vacantUnits }));
}

export function TowerListRealtime() {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const loadTowers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const towers = await fetchTowerData(supabase);
      setTowers(towers);
    } catch (err: any) {
      setError("Failed to load towers");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadTowers();
    // Subscribe to real-time changes
    const channel = supabase
      .channel('vacant_units_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vacant_units' }, () => {
        loadTowers();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadTowers, supabase]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Error Loading Towers</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return <TowerList towers={towers} isLoading={loading} />;
} 