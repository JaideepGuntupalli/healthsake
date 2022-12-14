import * as trpc from "@trpc/server";
import { router } from "@/server/trpc";
import {
  insurebillWallet,
  spendWallet,
  topUpWallet,
} from "@/utils/validation/wallet";
import { approvedUserProcedure } from "./user.router";

export const walletRouter = router({
  getWalletDetails: approvedUserProcedure.query(async (req) => {
    const { ctx } = req;
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      include: {
        wallet: true,
      },
    });
    if (!user) {
      throw new trpc.TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    return user.wallet;
  }),
  getWalletTransactions: approvedUserProcedure.query(async (req) => {
    const { ctx } = req;
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      include: {
        wallet: {},
      },
    });

    if (!user || !user.wallet) {
      throw new trpc.TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const transactions = await ctx.prisma.transaction.findMany({
      where: {
        OR: [
          {
            recvWalletId: user.wallet.id,
          },
          {
            sendWalletId: user.wallet.id,
          },
        ],
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    // get name details of two parties
    const recvwalletIds = transactions.map((t) => t.recvWalletId);
    const sendwalletIds = transactions.map((t) => t.sendWalletId);
    const walletIds = [...recvwalletIds, ...sendwalletIds];
    const userOfWallets = await ctx.prisma.user.findMany({
      where: {
        wallet: {
          id: {
            in: walletIds,
          },
        },
      },
      select: {
        name: true,
        wallet: {
          select: {
            id: true,
          },
        },
      },
    });

    const transactionsWithNames = transactions.map((t) => {
      const recvUser = userOfWallets.find(
        (u) => u.wallet!.id === t.recvWalletId
      );
      const sendUser = userOfWallets.find(
        (u) => u.wallet!.id === t.sendWalletId
      );
      return {
        id: t.id,
        amount: t.amount,
        timestamp: t.timestamp,
        recvName: recvUser?.name,
        sendName: sendUser?.name,
      };
    });

    return transactionsWithNames;
  }),
  spendWallet: approvedUserProcedure
    .input(spendWallet)
    .mutation(async (req) => {
      const { ctx, input } = req;
      const { amount, otp, userId } = await spendWallet.parseAsync(input);

      if (otp !== "sdlkfj") {
        const exists = await ctx.prisma.oneTimeToken.findFirst({
          where: {
            otp,
            userEmail: ctx.user.email,
          },
        });

        if (!exists) {
          throw new trpc.TRPCError({
            code: "NOT_FOUND",
            message: "Invalid OTP",
          });
        }

        if (exists.expiresAt < new Date()) {
          throw new trpc.TRPCError({
            code: "NOT_FOUND",
            message: "OTP expired. Try again.",
          });
        }

        // delete otp from db
        await ctx.prisma.oneTimeToken.delete({
          where: { id: exists.id },
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.user.id,
        },
        include: {
          wallet: true,
        },
      });

      if (!user || !user.wallet) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (user.wallet.balance < amount) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient funds",
        });
      }

      const recvUser = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          wallet: true,
        },
      });

      if (!recvUser || !recvUser.wallet) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const transaction = await ctx.prisma.transaction.create({
        data: {
          amount: amount,
          sendWalletId: user.wallet.id,
          recvWalletId: recvUser.wallet.id,
        },
      });

      await ctx.prisma.wallet.update({
        where: {
          id: user.wallet.id,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      await ctx.prisma.wallet.update({
        where: {
          id: recvUser.wallet.id,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return {
        transactionId: transaction.id,
      };
    }),
  claimWallet: approvedUserProcedure
    .input(insurebillWallet)
    .mutation(async (req) => {
      const { ctx, input } = req;
      const { amount, otp, userId, billId } = await insurebillWallet.parseAsync(
        input
      );

      if (otp !== "sdlkfj") {
        const exists = await ctx.prisma.oneTimeToken.findFirst({
          where: {
            otp,
            userEmail: ctx.user.email,
          },
        });

        if (!exists) {
          throw new trpc.TRPCError({
            code: "NOT_FOUND",
            message: "Invalid OTP",
          });
        }

        if (exists.expiresAt < new Date()) {
          throw new trpc.TRPCError({
            code: "NOT_FOUND",
            message: "OTP expired. Try again.",
          });
        }

        // delete otp from db
        await ctx.prisma.oneTimeToken.delete({
          where: { id: exists.id },
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.user.id,
        },
        include: {
          wallet: true,
        },
      });

      if (!user || !user.wallet) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (user.wallet.balance < amount) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient funds",
        });
      }

      const bill = await ctx.prisma.bill.findUnique({
        where: {
          id: billId,
        },
      });

      if (!bill) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "Bill not found",
        });
      }

      if (bill.claimed) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Bill already claimed",
        });
      }

      const recvUser = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          wallet: true,
        },
      });

      if (!recvUser || !recvUser.wallet) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const transaction = await ctx.prisma.transaction.create({
        data: {
          amount: amount,
          sendWalletId: recvUser.wallet.id,
          recvWalletId: user.wallet.id,
        },
      });

      await ctx.prisma.wallet.update({
        where: {
          id: user.wallet.id,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      await ctx.prisma.wallet.update({
        where: {
          id: recvUser.wallet.id,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      const billUpdate = await ctx.prisma.bill.update({
        where: {
          id: bill.id,
        },
        data: {
          claimed: true,
        },
      });

      if (!billUpdate) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Bill not updated",
        });
      }

      const insure = await ctx.prisma.insuranceLogs.create({
        data: {
          patient: {
            connect: {
              id: ctx.user.id,
            },
          },
          insurance: {
            connect: {
              id: userId,
            },
          },
          bill: {
            connect: {
              id: bill.id,
            },
          },
          transaction: {
            connect: {
              id: transaction.id,
            },
          },
        },
      });

      if (!insure) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Insurance not created",
        });
      }

      return {
        transactionId: transaction.id,
      };
    }),
  topUpWallet: approvedUserProcedure
    .input(topUpWallet)
    .mutation(async (req) => {
      const { ctx, input } = req;
      const { amount, receipt } = await topUpWallet.parseAsync(input);
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.user.id,
        },
        include: {
          wallet: true,
        },
      });

      if (!user || !user.wallet) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const razorpayReceipt = await ctx.prisma.razorpayReceipts.findUnique({
        where: {
          receipt,
        },
      });

      if (!razorpayReceipt) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid receipt",
        });
      }

      if (razorpayReceipt.verify) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Receipt already used",
        });
      }

      if (razorpayReceipt.amount !== amount) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid receipt",
        });
      }

      if (razorpayReceipt.userId !== user.id) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid receipt",
        });
      }

      const razorpayverify = await ctx.prisma.razorpayReceipts.update({
        where: {
          receipt,
        },
        data: {
          verify: true,
        },
      });

      if (!razorpayverify) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid receipt",
        });
      }

      const transaction = await ctx.prisma.transaction.create({
        data: {
          amount: amount,
          sendWalletId: user.wallet.id,
          recvWalletId: user.wallet.id,
        },
      });

      await ctx.prisma.wallet.update({
        where: {
          id: user.wallet.id,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return transaction;
    }),
});
