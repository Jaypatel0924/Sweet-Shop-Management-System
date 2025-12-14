import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  userId: string;
  items: Array<{
    sweetId: string;
    name: string;
    price: number;
    quantity: number;
    selectedSize: string;
  }>;
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  deliveryInfo: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  estimatedDeliveryDate: string;
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: [
      {
        sweetId: String,
        name: String,
        price: Number,
        quantity: Number,
        selectedSize: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentId: String,
    deliveryInfo: {
      fullName: String,
      email: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    estimatedDeliveryDate: String,
    orderStatus: { type: String, enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
