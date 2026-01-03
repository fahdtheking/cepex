import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Deal } from './deal.entity';

export enum ProposalType {
    PRICE = 'PRICE',
    SCOPE = 'SCOPE',
    TIMELINE = 'TIMELINE',
    TERMS = 'TERMS',
    PARTNERSHIP_MODEL = 'PARTNERSHIP_MODEL'
}

export enum ProposalStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    COUNTERED = 'COUNTERED',
    WITHDRAWN = 'WITHDRAWN'
}

/**
 * Structured Proposal - the atomic unit of negotiation
 * Every proposal is immutable once created
 * Counter-proposals create new Proposal entities linked to parent
 */
@Entity('proposals')
export class Proposal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Deal, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dealId' })
    deal: Deal;

    @Column()
    dealId: string;

    // Proposal Identity
    @Column({ type: 'enum', enum: ProposalType })
    type: ProposalType;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    proposedBy: string; // User ID

    // Versioning (for counter-proposals)
    @Column({ nullable: true })
    parentProposalId: string; // If this is a counter-proposal

    @ManyToOne(() => Proposal, { nullable: true })
    @JoinColumn({ name: 'parentProposalId' })
    parentProposal: Proposal;

    @Column({ default: 1 })
    version: number; // Increments with each counter

    // Structured Content
    @Column({ type: 'jsonb' })
    fields: Array<{
        field: string;
        currentValue: any;
        proposedValue: any;
        reasoning?: string;
    }>;

    // Status & Resolution
    @Column({ type: 'enum', enum: ProposalStatus, default: ProposalStatus.PENDING })
    status: ProposalStatus;

    @Column({ nullable: true })
    respondedBy: string; // User ID who accepted/rejected

    @Column({ nullable: true })
    respondedAt: Date;

    // Impact Assessment
    @Column({ type: 'jsonb', nullable: true })
    impact: {
        estimatedValueChange?: number;
        riskLevelChange?: string;
        timelineImpact?: string;
    };

    // Metadata
    @Column({ type: 'text', nullable: true })
    notes: string; // Optional context
}
