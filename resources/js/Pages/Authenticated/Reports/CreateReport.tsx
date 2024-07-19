import * as React from 'react';
import { pdf } from '@react-pdf/renderer';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { usePage } from '@inertiajs/react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
// Custom
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { LogSelectionStep } from '@/Components/Reports/LogSelectionStep';
import { ImagesAndMetereologicalDataStep } from '@/Components/Reports/ImagesAndMetereologicalDataStep';
import { ReportDocument } from '@/Components/Reports/ReportBuilder';
import { ReportVisualization } from '@/Components/Reports/ReportBuilder';

export interface SelectedLog {
    id: string;
    name: string;
    met_data: {
        temperature: { initial: string; final: string };
        humidity: { initial: string; final: string };
        wind_speed: { initial: string; final: string };
    };
    image: string;
}

interface FormStepProps {
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>;
    client: string;
    pilot: string;
}

const schema = yup.object({
    pilot: yup.string().not([''], 'Selecione uma opção'),
    client: yup.string().not([''], 'Selecione uma opção'),
    name: yup.string().required('Informe o nome'),
    state: yup.string().required('Informe o estado'),
    city: yup.string().required('Informe a cidade'),
    farm: yup.string().required('Informe o nome da fazenda'),
    area: yup.string().required('Informe a área'),
    date: yup.string().required('Informe a data da aplicação'),
    application_number: yup.string().required('Informe o número da aplicação'),
    dosage: yup.string().required('Informe a dosagem'),
    provider: yup.string().required('Informe o nome do fornecedor'),
});

type FormData = yup.InferType<typeof schema>;

export default function CreateReport() {
    
    const { serviceorder }: any = usePage().props;
    const { name, pilot, client, location } = serviceorder.data;

    const [processing, setProcessing] = React.useState<boolean>(false);
    const [step, setStep] = React.useState(1);
    const [logs, setLogs] = React.useState<SelectedLog[]>([]);
    const totalStep = 4;
    const progress = Math.ceil((step / totalStep) * 100);

    const { getValues, register, formState: { errors }, watch } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            client: client,
            pilot: pilot,
            application_number: name,
            city: location.city,
            state: location.state,
        },
    });

    watch(['name', 'pilot', 'client', 'city', 'state', 'farm', 'area', 'date', 'application_number', 'dosage', 'provider']);

    const handleNext = () => step < totalStep && setStep(step + 1);
    const handleBack = () => step > 1 && setStep(step - 1);

    const handleSubmit = async () => {
        const blob = await pdf(
            <ReportDocument
                data={{
                    pilot: getValues('pilot'),
                    client: getValues('client'),
                    name: getValues('name'),
                    city: getValues('city'),
                    state: getValues('state'),
                    farm: getValues('farm'),
                    area: getValues('area'),
                    date: getValues('date'),
                    application_number: getValues('application_number'),
                    dosage: getValues('dosage'),
                    provider: getValues('provider'),
                    logs: logs,
                }}
            />
        ).toBlob();

        const file = new File([blob], `${getValues('name')}.pdf`, { type: 'application/pdf' });
        // Handle the file upload or further processing here
    };

    return (
        <AuthenticatedLayout>

            <ol className="flex items-center whitespace-nowrap">
                <li className="inline-flex items-center">
                    <a className="flex items-center text-sm text-gray-500 dark:text-white hover:text-blue-600 focus:outline-none focus:text-blue-600">
                        <svg className="flex-shrink-0 me-3 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Home
                    </a>
                    <svg className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                </li>
                <li className="inline-flex items-center">
                    <span className="flex items-center text-sm text-gray-500 dark:text-white hover:text-blue-600 focus:outline-none focus:text-blue-600">
                        Ordens de Serviço
                        <svg className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </span>
                </li>
                <li className="inline-flex items-center">
                    <span className="flex items-center text-sm text-gray-500 dark:text-white hover:text-blue-600 focus:outline-none focus:text-blue-600">
                        Relatórios
                        <svg className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </span>
                </li>
                <li className="inline-flex items-center text-sm font-semibold text-gray-800 dark:text-white truncate" aria-current="page">
                    Criar
                </li>
            </ol>

            <section>
                <div className="mx-auto py-16">
                    <div className="mb-10">
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Criar Relatório</h2>
                    </div>

                    <div>
                        <div className="mb-2 flex justify-between items-center">
                            <h3 className="text-md font-medium text-gray-800 dark:text-white">Procedimento {step}/4</h3>
                            <span className="text-sm text-gray-800 dark:text-white">{progress}%</span>
                        </div>
                        <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                            <div className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-5">
                        <button
                            type="button"
                            className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                            onClick={handleBack}
                            disabled={step === 1}
                        >
                            <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6"></path>
                            </svg>
                            Anterior
                        </button>
                        <button
                            type="button"
                            className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                            onClick={handleNext}
                            disabled={step === totalStep}
                        >
                            Próximo
                            <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6"></path>
                            </svg>
                        </button>
                    </div>

                    <div className="mt-5">
                        {step === 1 && <FormStep register={register} errors={errors} client={client} pilot={pilot} />}
                        {step === 2 && <LogSelectionStep logs={logs} setLogs={setLogs} />}
                        {step === 3 && <ImagesAndMetereologicalDataStep logs={logs} />}
                        {step === 4 && (
                            <div>
                                <div className="mb-5">
                                    <h2 className="mb-2 text-md font-bold text-gray-900 dark:text-white">Confirmação do Relatório</h2>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Para visualizar o relatório final, clique em "Ver Relatório". Depois de revisá-lo, clique em "Confirmar" para salvar o documento.
                                    </p>
                                </div>
                                <ReportVisualization
                                    data={{
                                        pilot: getValues('pilot'),
                                        client: getValues('client'),
                                        name: getValues('name'),
                                        city: getValues('city'),
                                        state: getValues('state'),
                                        farm: getValues('farm'),
                                        area: getValues('area'),
                                        date: getValues('date'),
                                        application_number: getValues('application_number'),
                                        dosage: getValues('dosage'),
                                        provider: getValues('provider'),
                                        logs: logs,
                                    }}
                                />
                                <button type="button" onClick={handleSubmit} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    Confirmar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}

const FormStep: React.FC<FormStepProps> = ({ register, errors, client, pilot }) => (
    <>
        <div className="mb-5">
            <h2 className="mb-4 text-md font-bold text-gray-900 dark:text-white">Formulário</h2>
            <p className="text-gray-500 dark:text-gray-400">Preencha todos os dados do formulário abaixo.</p>
        </div>
        <div className="grid gap-4 my-5 grid-cols-1 md:grid-cols-2">
            <div>
                <label htmlFor="name" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome do documento</label>
                <input type="text" {...register('name')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o nome do relatório" />
                <span className="text-red-500 text-sm">{errors.name ? String(errors.name.message) : ''}</span>
            </div>
            <div>
                <label htmlFor="client" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cliente</label>
                <select {...register('client')} id="client" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="" disabled>Selecione uma opção</option>
                    {client && <option value={client}>{client}</option>}
                    <option value="não informado">Nao Informar</option>
                </select>
                <span className="text-red-500 text-sm">{errors.client ? String(errors.client.message) : ''}</span>
            </div>
            <div>
                <label htmlFor="pilot" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Responsável</label>
                <select {...register('pilot')} id="pilot" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="" disabled>Selecione uma opção</option>
                    <option value={pilot}>{pilot}</option>
                    <option value="não informado">Não Informar</option>
                </select>
                <span className="text-red-500 text-sm">{errors.pilot ? String(errors.pilot.message) : ''}</span>
            </div>
            <div>
                <label htmlFor="state" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">UF</label>
                <input readOnly type="text" id="state" {...register('state')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o estado" />
                <span className="text-red-500 text-sm">{errors.state ? String(errors.state.message) : ''}</span>
            </div>
            <div>
                <label htmlFor="city" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cidade</label>
                <input readOnly type="text" id="city" {...register('city')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe a cidade" />
                <span className="text-red-500 text-sm">{errors.city ? String(errors.city.message) : ''}</span>
            </div>
            <div>
                <label htmlFor="farm" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fazenda</label>
                <input type="text" id="farm" {...register('farm')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o nome da fazenda" />
                <span className="text-red-500 text-sm">{errors.farm ? String(errors.farm.message) : ''}</span>
            </div>
            <div>
                <label htmlFor="provider" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fornecedor do Produto</label>
                <input type="text" id="provider" {...register('provider')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o nome do produto" />
                <span className="text-red-500 text-sm">{errors.provider ? String(errors.provider.message) : ''}</span>
            </div>
            <div>
                <label htmlFor="area" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Área total aplicada (ha)</label>
                <input type="text" id="area" {...register('area')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe a área total aplicada" />
                <span className="text-red-500 text-sm">{errors.area ? String(errors.area.message) : ''}</span>
            </div>
            <div>
                <label htmlFor="application_number" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Número da aplicação</label>
                <input type="text" id="application_number" {...register('application_number')} readOnly className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o número da aplicação" />
                <span className="text-red-500 text-sm">{errors.application_number ? String(errors.application_number.message) : ''}</span>
            </div>
            <div>
                <label htmlFor="dosage" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dosagem</label>
                <input type="text" id="dosage" {...register('dosage')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe a dosagem" />
                <span className="text-red-500 text-sm">{errors.dosage ? String(errors.dosage.message) : ''}</span>
            </div>
            <div>
                <label htmlFor="date" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data da aplicação</label>
                <input type="date" {...register('date')} id="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                <span className="text-red-500 text-sm">{errors.date ? String(errors.date.message) : ''}</span>
            </div>
        </div>
    </>
);
