import mongoose, { Schema, models, model, Document } from 'mongoose';

// Define the interface for the StudentReceipt
export interface IStudentReceipt extends Document {
  category: string;
  captureId: string; // PayPal capture ID (added)
  orderID: string; // PayPal order ID
  studentId: mongoose.Schema.Types.ObjectId;
  transactionId: string; // PayPal transaction ID (optional)
  amount: {
    currency_code: string; // Currency used (e.g., USD)
    value: number;
  };
  status: string; // Status of the transaction (e.g., 'COMPLETED', 'PENDING', 'FAILED')
  payment_source: {
    paypal: {
      email_address: string;
      account_id: string;
      account_status: string;
      name: {
        given_name: string;
        surname: string;
      };
      address: {
        country_code: string;
      };
    };
  };
  createTime: Date;
  updateTime?: Date;
  payer: {
    id: string; // PayPal payer ID
    name: {
      given_name: string;
      surname: string;
    };
    address: {
      address_line_1: string;
      admin_area_2: string;
      admin_area_1: string;
      postal_code: string;
      country_code: string;
    };
    email: string;
  };
  paymentIntent: 'CAPTURE' | 'AUTHORIZE';
  captures: {
    id: string;
    status: string;
    amount: {
      currency_code: string;
      value: string;
    };
    final_capture: boolean;
    seller_protection: {
      status: string;
      dispute_categories: [];
    };
    create_time: Date;
    update_time: Date;
  };
  taxes: {
    fee: string;
    fixed: string;
    amount: string;
  };
  type: string;
  captureTime?: Date;
  errorDetails?: {
    message: string;
    code: string;
  };
  paymentMethod: string;
  schoolYear: string;
}

const schema = new Schema<IStudentReceipt>(
  {
    captureId: { type: String, required: true },
    orderID: { type: String, required: true },
    category: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
    transactionId: { type: String, required: true },
    amount: {
      currency_code: { type: String, required: true },
      value: { type: Number, required: true },
    },
    status: { type: String, required: true },
    paymentMethod: { type: String },
    payment_source: {
      paypal: {
        email_address: { type: String},
        account_id: { type: String},
        account_status: { type: String},
        name: {
          given_name: { type: String},
          surname: { type: String},
        },
        address: {
          country_code: { type: String},
        },
      },
    },
    createTime: { type: Date, required: true },
    updateTime: { type: Date },
    payer: {
      id: { type: String },
      name: {
        given_name: { type: String },
        surname: { type: String },
      },
      address: {
        address_line_1: { type: String },
        admin_area_2: { type: String },
        admin_area_1: { type: String },
        postal_code: { type: String },
        country_code: { type: String },
      },
      email: { type: String },
    },
    paymentIntent: { type: String, enum: ['CAPTURE', 'AUTHORIZE'], default: 'CAPTURE' },
    captures: {
      id: { type: String },
      status: { type: String },
      amount: {
        currency_code: { type: String },
        value: { type: String },
      },
      final_capture: { type: Boolean },
      seller_protection: {
        status: { type: String },
        dispute_categories: [{ type: String }],
      },
      create_time: { type: Date },
      update_time: { type: Date },
    },
    taxes: {
      fee: { type: String },
      fixed: { type: String },
      amount: { type: String },
    },
    type: { type: String, required: true }, // Type of payment (e.g., 'DownPayment', 'FullPayment')
    captureTime: { type: Date },
    errorDetails: {
      message: { type: String },
      code: { type: String },
    },
    schoolYear: { type: String },
  },
  { timestamps: true }
);

// Create a model from the schema
const StudentReceipt = models.StudentReceipt || model<IStudentReceipt>('StudentReceipt', schema);

export default StudentReceipt;
