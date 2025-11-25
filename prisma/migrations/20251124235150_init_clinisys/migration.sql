-- CreateTable
CREATE TABLE "Usuario" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permiso" (
    "id" UUID NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioRol" (
    "usuario_id" UUID NOT NULL,
    "rol_id" UUID NOT NULL,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("usuario_id","rol_id")
);

-- CreateTable
CREATE TABLE "RolPermiso" (
    "rol_id" UUID NOT NULL,
    "permiso_id" UUID NOT NULL,

    CONSTRAINT "RolPermiso_pkey" PRIMARY KEY ("rol_id","permiso_id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medico" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,

    CONSTRAINT "Medico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cita" (
    "id" UUID NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "paciente_id" UUID NOT NULL,
    "medico_id" UUID NOT NULL,

    CONSTRAINT "Cita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtencionMedica" (
    "id" UUID NOT NULL,
    "cita_id" UUID NOT NULL,
    "diagnostico" TEXT NOT NULL,
    "observaciones" JSONB NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AtencionMedica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Procedimiento" (
    "id" UUID NOT NULL,
    "atencion_id" UUID NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "insumo_id" UUID NOT NULL,

    CONSTRAINT "Procedimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insumo" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "unidad_medida" TEXT NOT NULL,
    "stock_actual" INTEGER NOT NULL,
    "stock_minimo" INTEGER NOT NULL,

    CONSTRAINT "Insumo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoInsumo" (
    "id" UUID NOT NULL,
    "insumo_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "origen" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovimientoInsumo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsumoPaciente" (
    "id" UUID NOT NULL,
    "paciente_id" UUID NOT NULL,
    "insumo_id" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "atencion_id" UUID NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsumoPaciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolicitudCompra" (
    "id" UUID NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,
    "creado_por" UUID NOT NULL,
    "area" TEXT NOT NULL,

    CONSTRAINT "SolicitudCompra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolicitudCompraItem" (
    "id" UUID NOT NULL,
    "solicitud_id" UUID NOT NULL,
    "insumo_id" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "SolicitudCompraItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenCompra" (
    "id" UUID NOT NULL,
    "proveedor_id" UUID NOT NULL,
    "solicitud_id" UUID NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "OrdenCompra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenCompraItem" (
    "id" UUID NOT NULL,
    "orden_id" UUID NOT NULL,
    "insumo_id" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL NOT NULL,

    CONSTRAINT "OrdenCompraItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recepcion" (
    "id" UUID NOT NULL,
    "orden_id" UUID NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "responsable" UUID NOT NULL,

    CONSTRAINT "Recepcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecepcionDetalle" (
    "id" UUID NOT NULL,
    "recepcion_id" UUID NOT NULL,
    "insumo_id" UUID NOT NULL,
    "cantidad_recibida" INTEGER NOT NULL,

    CONSTRAINT "RecepcionDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Permiso_codigo_key" ON "Permiso"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_dni_key" ON "Paciente"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_ruc_key" ON "Proveedor"("ruc");

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolPermiso" ADD CONSTRAINT "RolPermiso_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolPermiso" ADD CONSTRAINT "RolPermiso_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "Permiso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "Medico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtencionMedica" ADD CONSTRAINT "AtencionMedica_cita_id_fkey" FOREIGN KEY ("cita_id") REFERENCES "Cita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procedimiento" ADD CONSTRAINT "Procedimiento_atencion_id_fkey" FOREIGN KEY ("atencion_id") REFERENCES "AtencionMedica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procedimiento" ADD CONSTRAINT "Procedimiento_insumo_id_fkey" FOREIGN KEY ("insumo_id") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInsumo" ADD CONSTRAINT "MovimientoInsumo_insumo_id_fkey" FOREIGN KEY ("insumo_id") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoPaciente" ADD CONSTRAINT "ConsumoPaciente_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoPaciente" ADD CONSTRAINT "ConsumoPaciente_insumo_id_fkey" FOREIGN KEY ("insumo_id") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoPaciente" ADD CONSTRAINT "ConsumoPaciente_atencion_id_fkey" FOREIGN KEY ("atencion_id") REFERENCES "AtencionMedica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudCompra" ADD CONSTRAINT "SolicitudCompra_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudCompraItem" ADD CONSTRAINT "SolicitudCompraItem_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "SolicitudCompra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudCompraItem" ADD CONSTRAINT "SolicitudCompraItem_insumo_id_fkey" FOREIGN KEY ("insumo_id") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "SolicitudCompra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompraItem" ADD CONSTRAINT "OrdenCompraItem_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "OrdenCompra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompraItem" ADD CONSTRAINT "OrdenCompraItem_insumo_id_fkey" FOREIGN KEY ("insumo_id") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recepcion" ADD CONSTRAINT "Recepcion_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "OrdenCompra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recepcion" ADD CONSTRAINT "Recepcion_responsable_fkey" FOREIGN KEY ("responsable") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecepcionDetalle" ADD CONSTRAINT "RecepcionDetalle_recepcion_id_fkey" FOREIGN KEY ("recepcion_id") REFERENCES "Recepcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecepcionDetalle" ADD CONSTRAINT "RecepcionDetalle_insumo_id_fkey" FOREIGN KEY ("insumo_id") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
