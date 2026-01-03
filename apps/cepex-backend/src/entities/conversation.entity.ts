import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    exporterId: string;

    @Column()
    importerId: string;

    @Column({ nullable: true })
    dealId: string;

    @Column({ nullable: true })
    subject: string;

    @Column({ default: 'OPEN' })
    status: string;

    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
