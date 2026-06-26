-- RPCs seguras para administrar vigilantes sin comparar pin_vigilante en frontend
-- Ejecutar en Supabase SQL Editor

begin;

create or replace function public.admin_pin_vigilante_disponible(p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_exists boolean;
begin
  -- Ajusta esta validación de rol según tu esquema real
  if public.is_admin() is distinct from true then
    raise exception 'unauthorized';
  end if;

  select exists (
    select 1
    from public.residentes r
    where r.pin_vigilante = trim(p_pin)
      and coalesce(r.tipo, '') = 'vigilante'
  ) into v_exists;

  return not v_exists;
end;
$$;

create or replace function public.admin_crear_vigilante(p_nombre text, p_pin text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_siguiente int := 1;
  v_id uuid;
begin
  if public.is_admin() is distinct from true then
    raise exception 'unauthorized';
  end if;

  if length(trim(p_pin)) <> 4 then
    raise exception 'pin_invalido';
  end if;

  if exists (
    select 1 from public.residentes
    where pin_vigilante = trim(p_pin)
      and coalesce(tipo,'') = 'vigilante'
  ) then
    raise exception 'pin_duplicado';
  end if;

  select coalesce(max(case when r.casa ~ '^[0-9]+$' then r.casa::int else 0 end), 0) + 1
  into v_siguiente
  from public.residentes r
  where r.tipo = 'vigilante'
    and r.privada = 'SEG';

  insert into public.residentes (
    nombre,
    tipo,
    privada,
    casa,
    pin_vigilante,
    activo,
    created_at
  ) values (
    p_nombre,
    'vigilante',
    'SEG',
    v_siguiente::text,
    trim(p_pin),
    true,
    now()
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.admin_actualizar_pin_vigilante(p_residente_id uuid, p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() is distinct from true then
    raise exception 'unauthorized';
  end if;

  if length(trim(p_pin)) <> 4 then
    raise exception 'pin_invalido';
  end if;

  if exists (
    select 1
    from public.residentes r
    where r.id <> p_residente_id
      and r.pin_vigilante = trim(p_pin)
      and coalesce(r.tipo,'') = 'vigilante'
  ) then
    raise exception 'pin_duplicado';
  end if;

  update public.residentes
  set pin_vigilante = trim(p_pin)
  where id = p_residente_id
    and tipo = 'vigilante';

  return true;
end;
$$;

revoke all on function public.admin_pin_vigilante_disponible(text) from public;
revoke all on function public.admin_crear_vigilante(text, text) from public;
revoke all on function public.admin_actualizar_pin_vigilante(uuid, text) from public;

grant execute on function public.admin_pin_vigilante_disponible(text) to authenticated;
grant execute on function public.admin_crear_vigilante(text, text) to authenticated;
grant execute on function public.admin_actualizar_pin_vigilante(uuid, text) to authenticated;

commit;
