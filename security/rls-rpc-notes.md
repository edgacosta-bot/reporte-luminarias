# RPC hardening checklist

Funciones detectadas desde frontend:
- `entrada_trabajador`
- `obtener_acceso_abierto`
- `obtener_residente_para_acceso`
- `registrar_entrada_trabajador`
- `registrar_salida_trabajador`
- `registrar_salida_trabajador_obra`
- `registrar_vivienda`
- `toggle_trabajador_activo`
- `validar_acceso_trabajador_obra`
- `validar_pin_vigilante`
- `validar_trabajador_hogar`

## Reglas recomendadas
1. Validar rol adentro de cada función (no confiar solo en frontend).
2. Usar `security definer` solo cuando sea indispensable.
3. Al usar `security definer`, fijar `search_path` explícito.
4. Restringir `execute` por rol cuando aplique.
5. Verificar que ninguna función permita escribir en lotes/casas ajenas.

## Plantilla mínima en función PL/pgSQL
```sql
if auth.uid() is null then
  raise exception 'unauthorized';
end if;
```

Y validar pertenencia a vivienda/rol antes de `insert/update/delete`.
