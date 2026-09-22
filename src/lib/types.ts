export type RiskLevel = 'CLEAN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface StorageSlotDelta {
  slot: string;
  label: string;
  prevValue: string;
  newValue: string;
  isHazardous: boolean;
  hazardReason?: string;
}

export interface OpcodeStep {
  step: string;
  opcode: string;
  arg?: string;
  isBlocked?: boolean;
  comment?: string;
}

export interface ThreatDetail {
  summary: string;
  pathogenicSignal: string;
  vectors: string[];
  remediation: string;
}

export interface CryptographicReceipt {
  stateRoot: string;
  eip712Attestation: string;
  txId: string;
  timestamp: string;
  gasSaved: string;
  simulatedBlockHash: string;
}

export interface PlainEnglishExplainer {
  scamPromise: string;
  scamSubtitle: string;
  actualAction: string;
  victimLoss: string;
  vernierAction: string;
  assetsProtected: string;
  whyThisMatters: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  tagline: string;
  category: 'EXPLOIT_PREVENTION' | 'STORAGE_HIJACK' | 'LEGITIMATE_EXECUTION';
  riskScore: number;
  riskLevel: RiskLevel;
  intent: {
    humanReadable: string;
    protocol: string;
    amount: string;
    targetContract: string;
    verifiedSource: boolean;
    contractName: string;
  };
  metrics: {
    gasSimulated: number;
    gasExpected: number;
    stateShiftsCount: number;
    storageSlotsTouched: number;
  };
  storageDeltas: StorageSlotDelta[];
  opcodeTrace: OpcodeStep[];
  threat: ThreatDetail;
  receipt: CryptographicReceipt;
  plainEnglish?: PlainEnglishExplainer;
}
