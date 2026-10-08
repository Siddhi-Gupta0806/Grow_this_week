import React, { useState, useEffect } from 'react';
import { AITelemetryLog } from '../types';
import { getTelemetryLogsApi } from '../utils/api';
import { Activity, Cpu, Clock, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const UnderTheHood: React.FC = () => {
  const [logs, setLogs] = useState<AITelemetryLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await getTelemetryLogsApi();
      setLogs(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const totalCalls = logs.length;
  const avgLatency = totalCalls > 0 ? (logs.reduce((a, b) => a + b.latency_ms, 0) / totalCalls).toFixed(1) : 0;
  const fallbackCount = logs.filter(l => l.fallback_used).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400">
            AI System Observability Dashboard
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-800 dark:text-cream-50 mt-1 flex items-center gap-2">
            <Activity className="w-7 h-7 text-sage-500" />
            <span>Under The Hood — AI Telemetry Logs</span>
          </h2>
        </div>

        <button
          onClick={fetchLogs}
          className="px-4 py-2 text-xs font-bold rounded-2xl bg-sage-500 text-cream-50 hover:bg-forest-800 transition-colors flex items-center gap-1.5 shadow-soft self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 border border-sage-500/20 shadow-soft text-center">
          <Cpu className="w-6 h-6 text-sage-500 mx-auto mb-1" />
          <span className="text-xs font-semibold opacity-70 block">Primary Model</span>
          <strong className="text-base text-forest-900 dark:text-cream-50">gemma-4-26b-a4b-it</strong>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-sage-500/20 shadow-soft text-center">
          <Clock className="w-6 h-6 text-sunrise-500 mx-auto mb-1" />
          <span className="text-xs font-semibold opacity-70 block">Average Latency</span>
          <strong className="text-base text-forest-900 dark:text-cream-50">{avgLatency} ms</strong>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-sage-500/20 shadow-soft text-center">
          <Zap className="w-6 h-6 text-botanical-gold mx-auto mb-1" />
          <span className="text-xs font-semibold opacity-70 block">Fallback Model Usage</span>
          <strong className="text-base text-forest-900 dark:text-cream-50">{fallbackCount} Calls</strong>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-sage-500/20 shadow-soft text-center">
          <Activity className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <span className="text-xs font-semibold opacity-70 block">Total Traced Calls</span>
          <strong className="text-base text-forest-900 dark:text-cream-50">{totalCalls} Logs</strong>
        </div>
      </div>

      {/* Log Table */}
      <div className="glass-card rounded-3xl p-6 border border-sage-500/20 shadow-soft space-y-4">
        <h3 className="font-serif font-bold text-lg">Recent AI Call Traces</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sage-500/20 text-forest-500 dark:text-sage-400 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Trace ID</th>
                <th className="py-2.5 px-3">Endpoint</th>
                <th className="py-2.5 px-3">Model Used</th>
                <th className="py-2.5 px-3">Latency</th>
                <th className="py-2.5 px-3">Tokens</th>
                <th className="py-2.5 px-3">Fallback</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-500/10">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 text-center italic text-forest-500">
                    No AI call logs recorded yet. Generate a weekly plan or ask Gemma a question!
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-sage-50/50 dark:hover:bg-forest-800/50">
                    <td className="py-2.5 px-3 font-mono text-[11px]">{log.id}</td>
                    <td className="py-2.5 px-3 font-semibold">{log.endpoint}</td>
                    <td className="py-2.5 px-3">{log.model_used}</td>
                    <td className="py-2.5 px-3 font-bold">{log.latency_ms} ms</td>
                    <td className="py-2.5 px-3">in:{log.input_tokens} / out:{log.output_tokens}</td>
                    <td className="py-2.5 px-3">
                      {log.fallback_used ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-600 font-bold">YES</span>
                      ) : (
                        <span className="opacity-50">NO</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 font-bold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
