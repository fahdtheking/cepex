import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { DealEvent } from './deal-event.entity';
import { Proposal } from './proposal.entity';
import { PartnershipProposal } from './partnership-proposal.entity';

export enum DealStage {
    DISCOVERY = 'DISCOVERY',
    MATCHING = 'MATCHING',
    NEGOTIATION = 'NEGOTIATION',
    STRUCTURING = 'STRUCTURING',
    EXECUTION = 'EXECUTION',
    SCALING = 'SCALING',
    COMPLETED = 'COMPLETED',
    ARCHIVED = 'ARCHIVED'
}

export enum RiskLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    STRATEGIC = 'STRATEGIC'
}

export enum DealStatus {
    MATCHING = 'MATCHING',
    ACTIVE = 'ACTIVE',
    AGREED = 'AGREED',
    PAUSED = 'PAUSED',
    CLOSED = 'CLOSED',
    SCALED = 'SCALED',
    COMPLETED = 'COMPLETED'
}

@Entity('deals')
export class Deal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    dealCode: string; // Human-readable: TUN-OLIVE-2024-001

    // Parties (immutable after creation)
    @Column()
    initiatorId: string; // Exporter/Service Provider

    @Column()
    respondentId: string; // Importer/Buyer

    @Column({ nullable: true })
    architectId: string; // Optional Deal Architect

    @Column({ nullable: true })
    productId: string;

    @ManyToOne('Product', { nullable: true })
    @JoinColumn({ name: 'productId' })
    product: any;

    @Column({ nullable: true })
    serviceId: string;

    @ManyToOne('Service', { nullable: true })
    @JoinColumn({ name: 'serviceId' })
    service: any;

    // Current State (derived from events)
    @Column({ type: 'enum', enum: DealStage, default: DealStage.DISCOVERY })
    currentStage: DealStage;

    @Column({ type: 'enum', enum: RiskLevel, default: RiskLevel.LOW })
    currentRisk: RiskLevel;

    @Column({ type: 'enum', enum: DealStatus, default: DealStatus.ACTIVE })
    status: DealStatus;

    // Event Log (append-only truth)
    @OneToMany(() => DealEvent, event => event.deal, { cascade: true })
    events: DealEvent[];

    // Proposals (negotiation units)
    @OneToMany(() => Proposal, proposal => proposal.deal)
    proposals: Proposal[];

    // Partnership Proposals (DropPay suggestions)
    @OneToMany(() => PartnershipProposal, partnership => partnership.deal)
    partnershipProposals: PartnershipProposal[];

    // Metadata
    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>; // Flexible extensibility

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    lastActivityAt: Date;
}
