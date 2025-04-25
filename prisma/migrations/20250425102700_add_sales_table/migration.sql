-- CreateTable
CREATE TABLE "Sales" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);
