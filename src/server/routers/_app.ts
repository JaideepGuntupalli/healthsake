import { router } from "@/server/trpc";
import { userRouter } from "@/server/routers/user.router";
import { otpRouter } from "@/server/routers/otp.router";
import { adminRouter } from "./admin.router";
import { fileRouter } from "./file.router";
import { authedUsersRouter } from "./authedUsers.router";
import { verifyRouter } from "./verify.router";
import { authRouter } from "./auth.router";
import { walletRouter } from "./wallet.router";
import { pharmRouter } from "./pharm.router";
import { patientRouter } from "./patient.router";

export const appRouter = router({
  user: userRouter,
  otp: otpRouter,
  admin: adminRouter,
  authedUsers: authedUsersRouter,
  file: fileRouter,
  verify: verifyRouter,
  auth: authRouter,
  wallet: walletRouter,
  pharm: pharmRouter,
  patient: patientRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
