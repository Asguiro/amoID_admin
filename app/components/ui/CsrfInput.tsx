export function CsrfInput({ token }: { token: string }) {
  return <input type="hidden" name="_csrf" value={token} />;
}
