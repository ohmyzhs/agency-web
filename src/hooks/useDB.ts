/**
 * DB 훅 — provider.tsx의 컨텍스트에서 DB 인스턴스를 가져온다.
 * DB가 준비되지 않은 경우 null을 반환한다.
 */
export { useDB, useDBState } from '@/lib/typing/db/provider';
