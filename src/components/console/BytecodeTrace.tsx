'use client';

import React from 'react';
import { Terminal, ShieldX, PlayCircle } from 'lucide-react';
import { OpcodeStep } from '../../lib/types';

interface BytecodeTraceProps {
  opcodes: OpcodeStep[];
}

export const BytecodeTrace: React.FC<BytecodeTraceProps> = ({ opcodes }) => {
  return (
    <div className="p-4 rounded-lg border border-[#1e293b] bg-[#0f172a] space-y-3">
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            BYTECODE SIMULATION TRACE
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">OPCODE ASM</span>
      </div>

      {/* Disassembly Stream */}
      <div className="h-64 overflow-y-auto font-mono text-xs space-y-1 bg-[#0a0d14] p-2.5 rounded border border-[#1e293b]">
        {opcodes.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 py-0.5 px-1.5 rounded transition-colors ${
              item.isBlocked
                ? 'bg-rose-950/60 border border-rose-500/50 text-rose-300 font-bold'
                : 'hover:bg-slate-800/40 text-slate-300'
            }`}
          >
            <span className="text-slate-600 select-none text-[10px] w-6 shrink-0 font-mono-numbers">
              {item.step}
            </span>
            <span
              className={`font-semibold shrink-0 ${
                item.isBlocked
                  ? 'text-rose-400'
                  : item.opcode === 'SSTORE' || item.opcode === 'DELEGATECALL'
                  ? 'text-amber-400'
                  : item.opcode === 'CALL'
                  ? 'text-cyan-400'
                  : 'text-slate-200'
              }`}
            >
              [{item.opcode}]
            </span>
            {item.arg && <span className="text-slate-400 truncate">{item.arg}</span>}

            {item.isBlocked && (
              <span className="ml-auto text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
                <ShieldX className="w-3 h-3 text-rose-500" />
                BLOCKED
              </span>
            )}
            {item.comment && (
              <span className="text-slate-500 text-[10px] italic ml-auto truncate max-w-[140px]">
                // {item.comment}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="text-[10px] font-mono text-slate-400 flex justify-between">
        <span>STATUS: SIMULATION COMPLETE</span>
        <span>TRACED BY VIEM</span>
      </div>
    </div>
  );
};
