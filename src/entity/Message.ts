import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  createdDate: Date;

  @Column()
  lastUpdatedDate: Date;

  @Column()
  createdBy: number;

  @Column()
  lastUpdatedBy: number;
}
