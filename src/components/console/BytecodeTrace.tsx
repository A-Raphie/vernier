import React from 'react';
import { Terminal, ShieldAlert } from 'lucide-react';
import { OpcodeStep } from '../../lib/types';
import { Card, Badge } from '../ui';

interface BytecodeTraceProps {
  opcodes: OpcodeStep[];
  activeStepIndex: number;
  onSelectStep: (index: number) => void;
}

export const BytecodeTrace: React.FC<BytecodeTraceProps> = ({
  opcodes,
  activeStepIndex,
  onSelectStep,
}) => {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
        <div className="flex items-center gap-2">
          <Terminal className="size-3.5 text-slate-400" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
            BYTECODE TRACE
          </span>
        </div>
        <Badge variant="outline">DISASSEMBLY</Badge>
      </div>

      {/* Disassembly Stream with Step Highlighting */}
      <div className="h-64 overflow-y-auto font-mono text-xs space-y-0.5 bg-[#090d16] p-2 rounded border border-slate-800">
        {opcodes.map((item, idx) => {
          const isActive = idx === activeStepIndex;

          return (
            <button
              key={idx}
              onClick={() => onSelectStep(idx)}
              className={`w-full text-left flex items-center gap-2 py-1 px-1.5 rounded transition-colors cursor-pointer ${
                isActive
                  ? item.isBlocked
                    ? 'bg-rose-950/60 border border-rose-700/80 text-rose-200 font-bold'
                    : 'bg-amber-950/40 border border-amber-500/50 text-amber-200 font-semibold'
                  : 'hover:bg-slate-800/40 text-slate-400 border border-transparent'
              }`}
            >
              <span className={`text-[10px] w-6 shrink-0 tabular-nums ${isActive ? 'text-amber-400 font-bold' : 'text-slate-600'}`}>
                {isActive ? '▶' : item.step}
              </span>
              <span
                className={`shrink-0 font-medium ${
                  item.isBlocked
                    ? 'text-rose-400'
                    : item.opcode === 'SSTORE' || item.opcode === 'DELEGATECALL'
                    ? 'text-amber-400'
                    : 'text-slate-200'
                }`}
              >
                [{item.opcode}]
              </span>
              {item.arg && (
                <span className="text-slate-400 truncate text-[11px] max-w-[110px]">
                  {item.arg}
                </span>
              )}

              {item.isBlocked && (
                <Badge variant="destructive" size="sm" className="ml-auto text-[9px] py-0 px-1">
                  <ShieldAlert className="size-2.5 mr-0.5" />
                  BLOCKED
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-[10px] font-mono text-slate-500 flex justify-between">
        <span>Click any opcode to jump</span>
        <span>VIEM EVM TRACE</span>
      </div>
    </Card>
  );
};
