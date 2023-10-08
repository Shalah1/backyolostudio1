import { AdminEntity } from 'src/admin/adminentity.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity("user") // Update the entity name if needed
export class UserEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  nameU: string;

  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true })
  password: string;
  @Column({ nullable: true })
  address: string;

  // @Column()
  // filename : string;

  @ManyToOne(() => AdminEntity, (admin) => admin.users)
  admin: AdminEntity;
   
}
