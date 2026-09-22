// Harvested from: https://beautifului.dev#approval-card & https://beui.dev/r/approval-card
// Re-expressed on semantic tokens

import * as React from 'react';
import { cn } from '../../lib/utils';
import { ShieldAlert, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';

export interface ApprovalCardProps {
  title: string;
  subtitle: string;
  promisedAction: string;
  actualAction: string;
  isHazard: boolean;
  hazardReason?: string;
  assetsProtected?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onViewProof?: () => void;
  className?: string;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  title,
  subtitle,
  promisedAction,
  actualAction,
  isHazard,
  hazardReason,
  assetsProtected,
  onApprove,
  onReject,
  onViewProof,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border p-5 shadow-xl transition-all duration-200',
        isHazard
          ? 'border-rose-700/60 bg-gradient-to-b from-[#160b13] to-[#090d16]'
          : 'border-emerald-700/60 bg-gradient-to-b from-[#0b1612] to-[#090d16]',
        className,
      )}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          {isHazard ? (
            <ShieldAlert className="size-4 text-rose-400" />
          ) : (
            <ShieldCheck className="size-4 text-emerald-400" />
          )}
          <span className="font-sans font-bold text-sm text-white">{title}</span>
        </div>
        <Badge variant={isHazard ? 'destructive' : 'success'} dot dotPulse>
          {isHazard ? 'CRITICAL DRAIN BLOCKED' : 'VERIFIED SAFE'}
        </Badge>
      </div>

      {/* Subtitle / Context */}
      <p className="text-xs text-slate-400 font-sans mt-3 leading-relaxed">
        {subtitle}
      </p>

      {/* Promised vs Reality Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        <div className="p-3 rounded-lg border border-slate-800/80 bg-[#090d16] space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            1. What The dApp Prompts
          </div>
          <div className="font-sans text-xs font-semibold text-slate-100">
            {promisedAction}
          </div>
        </div>

        <div
          className={cn(
            'p-3 rounded-lg border space-y-1',
            isHazard
              ? 'border-rose-900/60 bg-rose-950/30'
              : 'border-emerald-900/60 bg-emerald-950/30',
          )}
        >
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            2. Calldata Reality
          </div>
          <div
            className={cn(
              'font-sans text-xs font-semibold',
              isHazard ? 'text-rose-300' : 'text-emerald-300',
            )}
          >
            {actualAction}
          </div>
        </div>
      </div>

      {/* Hazard Warning or Clean Seal Callout */}
      {isHazard && hazardReason && (
        <div className="p-2.5 rounded border border-rose-800/80 bg-rose-950/40 text-xs text-rose-200 font-sans mb-4 flex items-center justify-between gap-2">
          <span>🚨 {hazardReason}</span>
          {assetsProtected && (
            <span className="font-mono text-[11px] text-amber-300 shrink-0">
              {assetsProtected}
            </span>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        {onViewProof && (
          <button
            type="button"
            onClick={onViewProof}
            className="text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>View Cryptographic Proof</span>
            <ArrowRight className="size-3" />
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {isHazard ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={onReject}
              leftIcon={<ShieldAlert className="size-3.5" />}
            >
              HALT & ISOLATE DRAINER
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onApprove}
              leftIcon={<ShieldCheck className="size-3.5" />}
            >
              SAFE TO SIGN
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
