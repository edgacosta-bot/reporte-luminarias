# Plan de hardening Supabase (RLS)

Este proyecto usa `anon key` en frontend, lo cual es normal en apps cliente.
La seguridad real depende de RLS y policies en Supabase.

## Objetivo
- Bloquear acceso por defecto.
- Abrir solo lo necesario por rol y por relación `auth.uid() -> residentes.user_id`.
- Mantener operaciones sensibles en RPC controladas o service role.

## Archivos
- `security/rls-base.sql`: habilita RLS y políticas base por tabla.
- `security/rls-rpc-notes.md`: checklist para asegurar funciones RPC.

## Cómo aplicar
1. Respaldar DB/proyecto en Supabase.
2. Ejecutar `security/rls-base.sql` en SQL Editor.
3. Probar pantallas críticas con usuarios reales (colono/admin/vigilante).
4. Ajustar policies de tablas especiales según tus datos reales.

## Nota
Las policies incluidas son conservadoras para evitar exposición masiva.
Puede requerir ajustes finos en tablas de operación interna.
