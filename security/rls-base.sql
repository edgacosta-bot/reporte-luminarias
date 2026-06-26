-- Baseline RLS for reporte-luminarias
-- Ejecutar en Supabase SQL Editor.
-- Ajustar policies específicas según tu modelo final de datos.

begin;

-- 1) Activar RLS en tablas usadas por frontend.
alter table if exists public.residentes enable row level security;
alter table if exists public.habitantes enable row level security;
alter table if exists public.incidencias_vecinales enable row level security;
alter table if exists public.incidencias_trabajadores enable row level security;
alter table if exists public.reportes_obras enable row level security;
alter table if exists public.reportes_seguridad enable row level security;
alter table if exists public.reportes_vigilantes enable row level security;
alter table if exists public.reportes_agua_caasim enable row level security;
alter table if exists public.pagos_residentes enable row level security;
alter table if exists public.paquetes enable row level security;
alter table if exists public.accesos_propietarios enable row level security;
alter table if exists public.accesos_trabajadores enable row level security;
alter table if exists public.accesos_servicios enable row level security;
alter table if exists public.servicios_arribo enable row level security;
alter table if exists public.trabajadores_hogar enable row level security;
alter table if exists public.trabajadores_obra enable row level security;
alter table if exists public.obras enable row level security;
alter table if exists public.notificaciones_pago enable row level security;
alter table if exists public.avisos_destinatarios enable row level security;
alter table if exists public.protocolos enable row level security;
alter table if exists public.catalogo_reportes enable row level security;
alter table if exists public.catalogo_servicios enable row level security;
alter table if exists public.catalogo_tipos_servicio enable row level security;
alter table if exists public.vigilantes enable row level security;
alter table if exists public.lotes enable row level security;
alter table if exists public.ubicaciones enable row level security;
alter table if exists public.comite_diseno enable row level security;

-- 2) Helpers simples para rol desde residentes.
create or replace function public.app_user_role()
returns text
language sql
stable
as $$
  select lower(coalesce(r.tipo, ''))
  from public.residentes r
  where r.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.app_user_role() in ('admin', 'administracion');
$$;

create or replace function public.is_vigilante()
returns boolean
language sql
stable
as $$
  select public.app_user_role() = 'vigilante';
$$;

create or replace function public.is_colono()
returns boolean
language sql
stable
as $$
  select public.app_user_role() in ('colono', 'residente');
$$;

-- 3) Policies base en residentes.
drop policy if exists residentes_self_select on public.residentes;
create policy residentes_self_select
on public.residentes
for select
to authenticated
using (user_id = auth.uid() or public.is_admin() or public.is_vigilante());

drop policy if exists residentes_self_update on public.residentes;
create policy residentes_self_update
on public.residentes
for update
to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

-- 4) Policies de reportes vecinales (dueño o admin/vigilante).
drop policy if exists incidencias_vecinales_select_scope on public.incidencias_vecinales;
create policy incidencias_vecinales_select_scope
on public.incidencias_vecinales
for select
to authenticated
using (
  public.is_admin() or public.is_vigilante() or
  exists (
    select 1
    from public.residentes r
    where r.user_id = auth.uid()
      and r.id = incidencias_vecinales.residente_id
  )
);

drop policy if exists incidencias_vecinales_insert_self on public.incidencias_vecinales;
create policy incidencias_vecinales_insert_self
on public.incidencias_vecinales
for insert
to authenticated
with check (
  public.is_admin() or
  exists (
    select 1
    from public.residentes r
    where r.user_id = auth.uid()
      and r.id = incidencias_vecinales.residente_id
  )
);

-- 5) Reportes de obras / vigilante / seguridad: lectura amplia para admin/vigilante.
drop policy if exists reportes_obras_select_scope on public.reportes_obras;
create policy reportes_obras_select_scope
on public.reportes_obras
for select
to authenticated
using (
  public.is_admin() or public.is_vigilante() or
  exists (
    select 1 from public.residentes r
    where r.user_id = auth.uid()
      and r.id = reportes_obras.residente_id
  )
);

drop policy if exists reportes_seguridad_select_admin_vig on public.reportes_seguridad;
create policy reportes_seguridad_select_admin_vig
on public.reportes_seguridad
for select
to authenticated
using (public.is_admin() or public.is_vigilante());

drop policy if exists reportes_vigilantes_select_admin_vig on public.reportes_vigilantes;
create policy reportes_vigilantes_select_admin_vig
on public.reportes_vigilantes
for select
to authenticated
using (public.is_admin() or public.is_vigilante());

-- 6) Catálogos: lectura para usuarios autenticados.
drop policy if exists catalogo_reportes_read on public.catalogo_reportes;
create policy catalogo_reportes_read
on public.catalogo_reportes
for select
to authenticated
using (true);

drop policy if exists catalogo_servicios_read on public.catalogo_servicios;
create policy catalogo_servicios_read
on public.catalogo_servicios
for select
to authenticated
using (true);

drop policy if exists catalogo_tipos_servicio_read on public.catalogo_tipos_servicio;
create policy catalogo_tipos_servicio_read
on public.catalogo_tipos_servicio
for select
to authenticated
using (true);

-- 7) Vigilantes: solo admin/vigilante.
drop policy if exists vigilantes_admin_vig_read on public.vigilantes;
create policy vigilantes_admin_vig_read
on public.vigilantes
for select
to authenticated
using (public.is_admin() or public.is_vigilante());

-- 8) En tablas operativas restantes, al menos bloquear anon y permitir authenticated solo a admin/vigilante por defecto.
-- Ajustar tabla por tabla según flujos reales.

commit;
