-- Login vigilante seguro por RPC (sin exponer tabla/pin en frontend)
-- Ejecutar en Supabase SQL Editor

begin;

create or replace function public.login_vigilante_por_pin(p_pin text)
returns table(id uuid, nombre text, activo boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select v.id, v.nombre, v.activo
  from public.vigilantes v
  where trim(v.pin::text) = trim(p_pin)
  limit 1;
end;
$$;

revoke all on function public.login_vigilante_por_pin(text) from public;
grant execute on function public.login_vigilante_por_pin(text) to anon, authenticated;

comment on function public.login_vigilante_por_pin(text)
is 'Valida PIN de vigilante y devuelve solo campos minimos (id, nombre, activo).';

commit;
