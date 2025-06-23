import { useEffect, useRef, useState } from 'react';
import supabase from '@/services/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

type LogStreamEntry = {
  id: string,
  message: string,
  timestamp: Date,
}

const useLogsStreaming = ({ function_id }: { function_id: string }) => {
  const logs = useRef<LogStreamEntry[]>([]);
  const [_, setToggle] = useState(false);

  const rerender = () => {
    setToggle(prev => !prev);
  }

  useEffect(() => {
    let logsChannel: RealtimeChannel | undefined;

    (async () => {
      const initialLogs = await supabase
        .from("function_logs")
        .select()
        .eq("function_id", function_id)
        .order("created_at", { ascending: true })
        .limit(69); // too much logs kinda hurts >n<!! only able to handle 69~~

      if (initialLogs.error) {
        console.error("Error fetching initial logs:", initialLogs.error);
      }

      logs.current = (initialLogs.data ?? []).map(log => ({
        id: log.id,
        message: log.message,
        timestamp: new Date(log.created_at),
      }));
      rerender();

      logsChannel = supabase
        .channel('function-logs')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'function_logs',
            filter: `function_id=eq.${function_id}`,
          },
          (payload) => {
            console.log('log:', payload);
            logs.current.push({
              id: payload.new.id,
              message: payload.new.message,
              timestamp: new Date(payload.new.created_at),
            });
            rerender();
          },
        )
        .subscribe();
    })();


    return () => {
      if (logsChannel) {
        supabase.removeChannel(logsChannel);
      }
    }
  }, []);

  return logs.current;
};

export default useLogsStreaming;
