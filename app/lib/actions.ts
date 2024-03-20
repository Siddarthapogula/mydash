'use server';
 import {z} from 'zod';
 import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id : z.string(),
    customerId : z.string(),
    amount : z.coerce.number(),
    status : z.enum(['pending','paid']),
    date : z.string()
})
const createInvoiceOmitSchema = FormSchema.omit({id : true, date : true});
export async function createInvoiceWithForm(formData: FormData) {
    const rawFormData = {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      };

    const {customerId, amount, status} = createInvoiceOmitSchema.parse(rawFormData);

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql `
    INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amount}, ${status}, ${date})
    `
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  
}