-- Hardening puntual para tabla vigilantes
-- Objetivo: impedir lectura directa de pin desde cliente
-- Ejecutar en Supabase SQL Editor

begin;

alter table if exists public.vigilantes enable row level security;

-- Quitar policy amplia previa si existe
-- (ajusta nombre si en tu proyecto tiene otro)
drop policy if exists vigilantes_admin_vig_read on public.vigilantes;

-- Solo admin puede leer tabla vigilantes directamente
-- (login_vigilante usa RPC security definer y no depende de esta lectura)
create policy vigilantes_admin_read_only
on public.vigilantes
for select
to authenticated
using (public.is_admin());

-- Opcional: bloquear modificaciones desde cliente
-- habilita solo si tus flujos escriben por backend/RPC controlada
-- create policy vigilantes_no_client_insert on public.vigilantes for insert to authenticated with check (false);
-- create policy vigilantes_no_client_update on public.vigilantes for update to authenticated using (false) with check (false);
-- create policy vigilantes_no_client_delete on public.vigilantes for delete to authenticated using (false);

commit;
