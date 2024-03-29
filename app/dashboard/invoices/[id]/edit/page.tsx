import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { notFound } from 'next/navigation';
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
 
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    console.log(id)
    let invoice;
    let customers;
    try {
        invoice = await fetchInvoiceById(id);
        customers = await fetchCustomers();
        console.log('at edit page tsx');
    } catch (error) {
        console.log('error', error);
    }
    if(!invoice){
      notFound();
    }
    
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/invoices/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            {invoice && customers && <Form invoice={invoice} customers={customers} />}
        </main>
    );
}
