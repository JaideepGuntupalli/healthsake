import { useUserContext } from "@/context/user.context";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

const PrescribePages = () => {
  const router = useRouter();
  const ctxUser = useUserContext();

  if (!ctxUser) {
    router.push("/");
    return <></>;
  }

  const { prescriptionId } = router.query;

  if (!prescriptionId) {
    return <p>Loading..</p>;
  }

  const { data: prescriptionLink } = trpc.patient.getPrescriptionLink.useQuery({
    prescriptionId: prescriptionId as string,
  });

  if (!prescriptionLink) {
    return <p>Loading..</p>;
  }

  router.push(prescriptionLink);

  return <div>Loading...</div>;
};

export default PrescribePages;
