import {NextPage} from "next";
import {useRouter} from "next/router";

import IntroLayout from "../../client/Layout/intro";
import {trpc} from "@/utils/trpc";
import {healthCareVerifySchema, patientVerifySchema,} from "@/utils/validation/verify";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useCallback, useState} from "react";
import {z} from "zod";
import {useUserContext} from "@/context/user.context";
import axios from "axios";

const Register: NextPage = () => {
    const router = useRouter();

    const userCtx = useUserContext();

    if (!userCtx) {
        router.push('/');
    }

    const {data, isLoading, error} = trpc.user.profile.useQuery();

    if (data && data.result.type !== "INDIVIDUAL") {
        router.push('/');
    }

    if (data && data.result.userVerified && data.result.status === "APPROVED") {
        router.push('/dashboard');
    }

    const didSubmit = data?.result.status === "PENDING";

    const logout = trpc.user.logout.useMutation();

    const toLogout = useCallback(async () => {
        logout.mutate();
        router.reload();
        await router.push('/');
    }, [logout, router]);

    const [isHealthCare, setIsHealthCare] = useState<boolean>(false);

    const formSchema = isHealthCare ? healthCareVerifySchema : patientVerifySchema;

    type FormSchemaType = z.infer<typeof formSchema>;

    const {register, handleSubmit, formState: {errors}} = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    const uploadFile = async (formData: FormData) => {
        const config = {
            headers: {'Content-Type': 'multipart/form-data',},
        };

        const response = await axios.post('/api/uploads', formData, config);

        console.log('response', response.data);
        return response.data;
    };

    const userVerify = trpc.user.userSubmitForVerification.useMutation({onSuccess: () => router.reload()});

    const onSubmit = useCallback(
        async (data: FormSchemaType) => {
            let formData = new FormData();
            formData.append("file", data.profileImage[0]);
            const imgUrl = await uploadFile(formData);
            formData = new FormData();
            formData.append("file", data.address[0]);
            const addUrl = await uploadFile(formData);
            formData = new FormData();
            formData.append("file", data.identity[0]);
            const idenUrl = await uploadFile(formData);

            const urlData = {
                profileImage: imgUrl.url,
                address: addUrl.url,
                identity: idenUrl.url,
            }

            if (isHealthCare) {
                const formData = new FormData();
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                formData.append("file", data.healthLicense[0]);
                const hl = await uploadFile(formData);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                urlData['healthLicense'] = hl.url;
            }
            console.log(urlData);
            // await uploadFile(formData);

            userVerify.mutate({
                role: isHealthCare ? "HEALTHCARE" : "PATIENT",
                ...urlData,
            });
        },
        [isHealthCare, userVerify]
    );

    return (
        <IntroLayout title="User Registration">
            <h1 className="font-semibold text-2xl">Verification</h1>
            {/* Account Registration Form */}
            {!didSubmit ? (<form className="flex flex-col gap-6"
                                 onSubmit={handleSubmit(onSubmit)}
                >
                    <label className="flex flex-col gap-2 text-sm">
                        Register as:
                        <select className="py-2 px-2 rounded-lg text-black" {...register("role")} onChange={(e) => {
                            e.target.value === 'HEALTHCARE' ? setIsHealthCare(true) : setIsHealthCare(false)
                            console.log(e.target.value)
                        }}>
                            <option value="PATIENT">Patient</option>
                            <option value="HEALTHCARE">HealthCare Professional</option>
                        </select>
                        {errors.role && <p className="text-xs text-red-500">{errors.role?.message}</p>}
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        Upload your Photo:
                        <input
                            className="py-2 px-2 rounded-lg text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            type="file" {...register("profileImage")}/>
                        {errors.profileImage &&
                            <p className="text-xs text-red-500">{JSON.stringify(errors.profileImage.message)}</p>}
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        Upload Identity Proof:
                        <input
                            className="py-2 px-2 rounded-lg text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            type="file" {...register("identity")}/>
                        {errors.identity &&
                            <p className="text-xs text-red-500">{JSON.stringify(errors.identity.message)}</p>}
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        Upload Address Proof:
                        <input
                            className="py-2 px-2 rounded-lg text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            type="file" {...register("address")}/>
                        {errors.address &&
                            <p className="text-xs text-red-500">{JSON.stringify(errors.address.message)}</p>}
                    </label>
                    {isHealthCare && (
                        <label className="flex flex-col gap-2 text-sm">
                            Upload Health License:
                            <input
                                className="py-2 px-2 rounded-lg text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                type="file" {...register("healthLicense")}/>
                            {// eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                errors?.healthLicense &&
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                <p className="text-xs text-red-500">{JSON.stringify(errors?.healthLicense.message)}</p>}
                        </label>)}

                    <button
                        className="rounded-xl p-3 px-8 text-sm transition-all ease-in-out bg-indigo-600 hover:shadow-2xl disabled:bg-indigo-900"
                        type="submit">Submit for Verification
                    </button>
                </form>) :
                (<h2>Waiting for Admin to approve...</h2>)}
            <button
                className="rounded-xl p-3 px-8 text-sm transition-all ease-in-out bg-indigo-600 hover:shadow-2xl disabled:bg-indigo-900"
                onClick={() => toLogout()}>Logout
            </button>
        </IntroLayout>
    );
}

export default Register;