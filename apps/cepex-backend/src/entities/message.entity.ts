import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    conversationId: string;

    @ManyToOne(() => Conversation, conversation => conversation.messages)
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;

    @Column()
    senderId: string;

    @Column()
    content: string;

    @Column({ default: false })
    isProforma: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
