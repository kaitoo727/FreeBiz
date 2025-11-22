-- 既存のテーブルを削除するスクリプト
-- 注意: このスクリプトはすべてのデータを削除します
-- 開発環境でのみ使用してください

-- 外部キー制約があるため、参照されるテーブルから順に削除
DROP TABLE IF EXISTS journal_entries CASCADE;
DROP TABLE IF EXISTS revenues CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS inventories CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- インデックスも削除（CASCADEで自動削除されるが、念のため）
DROP INDEX IF EXISTS idx_revenues_user_id;
DROP INDEX IF EXISTS idx_revenues_date;
DROP INDEX IF EXISTS idx_expenses_user_id;
DROP INDEX IF EXISTS idx_expenses_date;
DROP INDEX IF EXISTS idx_inventories_user_id;
DROP INDEX IF EXISTS idx_projects_user_id;
DROP INDEX IF EXISTS idx_journal_entries_user_id;
DROP INDEX IF EXISTS idx_journal_entries_date;

