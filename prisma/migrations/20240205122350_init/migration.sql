-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" VARCHAR(255),
    "password" VARCHAR(255),
    "address" VARCHAR(255),

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Layout" (
    "layout_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "layout_name" VARCHAR,

    CONSTRAINT "Layout_pkey" PRIMARY KEY ("layout_id")
);

-- CreateTable
CREATE TABLE "Widget" (
    "widget_id" SERIAL NOT NULL,
    "widget_name" VARCHAR(255),
    "widget_description" TEXT NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("widget_id")
);

-- CreateTable
CREATE TABLE "WidgetsOnLayouts" (
    "layout_id" INTEGER NOT NULL,
    "widget_id" INTEGER NOT NULL,

    CONSTRAINT "WidgetsOnLayouts_pkey" PRIMARY KEY ("layout_id","widget_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Layout" ADD CONSTRAINT "Layout_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WidgetsOnLayouts" ADD CONSTRAINT "WidgetsOnLayouts_layout_id_fkey" FOREIGN KEY ("layout_id") REFERENCES "Layout"("layout_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WidgetsOnLayouts" ADD CONSTRAINT "WidgetsOnLayouts_widget_id_fkey" FOREIGN KEY ("widget_id") REFERENCES "Widget"("widget_id") ON DELETE RESTRICT ON UPDATE CASCADE;
