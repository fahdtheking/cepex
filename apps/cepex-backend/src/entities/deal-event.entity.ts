import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Deal } from './deal.entity';

export enum DealEventType {
    // Lifecycle
    DEAL_CREATED = 'DEAL_CREATED',
    STAGE_ADVANCED = 'STAGE_ADVANCED',

    // Proposals & Scope
    PROPOSAL_CREATED = 'PROPOSAL_CREATED',
    SCOPE_MODIFIED = 'SCOPE_MODIFIED',
    PRICE_UPDATED = 'PRICE_UPDATED',

    // Risk & Milestones
    RISK_ADJUSTED = 'RISK_ADJUSTED',
    MILESTONE_CONFIRMED = 'MILESTONE_CONFIRMED',

    // System Events
    DEAL_PAUSED = 'DEAL_PAUSED',
    DEAL_CLOSED = 'DEAL_CLOSED',
    DEAL_SCALED = 'DEAL_SCALED',

    // DropPay Partnership Events (Phase 4)
    PARTNERSHIP_QUALIFIED = 'PARTNERSHIP_QUALIFIED',
    PARTNERSHIP_PROPOSED = 'PARTNERSHIP_PROPOSED',
    PARTNERSHIP_ACCEPTED = 'PARTNERSHIP_ACCEPTED',
    PARTNERSHIP_DECLINED = 'PARTNERSHIP_DECLINED',
    PARTNERSHIP_ACTIVATED = 'PARTNERSHIP_ACTIVATED',
    
    // DropPay Handover Events
    DROPPAY_HANDOVER_INITIATED = 'DROPPAY_HANDOVER_INITIATED'
}

export enum ActorRole {
    INITIATOR = 'INITIATOR',
    RESPONDENT = 'RESPONDENT',
    ARCHITECT = 'ARCHITECT',
    SYSTEM = 'SYSTEM'
}

@Entity('deal_events')
export class DealEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Deal, deal => deal.events, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dealId' })
    deal: Deal;

    @Column()
    dealId: string;

    // Event Identity
    @Column({ type: 'enum', enum: DealEventType })
    eventType: DealEventType;

    @CreateDateColumn()
    timestamp: Date;

    // Actor
    @Column()
    actorId: string;

    @Column({ type: 'enum', enum: ActorRole })
    actorRole: ActorRole;

    // Event Payload (flexible JSONB)
    @Column({ type: 'jsonb' })
    payload: Record<string, any>;

    // State Impact (optional - for events that change state)
    @Column({ nullable: true })
    stageChange: string; // New stage if this event caused stage transition

    @Column({ nullable: true })
    riskChange: string; // New risk level if this event adjusted risk
}

// Create index for efficient timeline queries
// Index will be created via TypeORM synchronize or migration
