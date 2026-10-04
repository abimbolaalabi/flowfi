import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StellarExplorerLink } from "../StellarExplorerLink";

// Mock the NetworkContext with a controllable `useNetwork`.
const { useNetworkMock } = vi.hoisted(() => ({ useNetworkMock: vi.fn() }));

vi.mock("@/context/NetworkContext", () => ({
  useNetwork: useNetworkMock,
}));

describe("StellarExplorerLink", () => {
  beforeEach(() => {
    useNetworkMock.mockReturnValue({ networkId: "testnet" });
  });

  it("generates correct Testnet URL", () => {
    render(
      <StellarExplorerLink type="tx" id="abc123hash" />
    );
    
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      "https://stellar.expert/explorer/testnet/tx/abc123hash"
    );
  });

  it("generates correct Mainnet URL when network is mainnet", () => {
    useNetworkMock.mockReturnValue({ networkId: "mainnet" });

    render(
      <StellarExplorerLink type="account" id="GABC123" />
    );
    
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      "https://stellar.expert/explorer/mainnet/account/GABC123"
    );
  });

  it("truncates long hashes by default", () => {
    render(
      <StellarExplorerLink type="tx" id="abcdefghijklmnopqrstuvwxyz123456" />
    );
    
    expect(screen.getByText(/abcdef\.\.\.123456/)).toBeInTheDocument();
  });

  it("shows full hash when truncate is false", () => {
    const fullHash = "abcdefghijklmnopqrstuvwxyz123456";
    render(
      <StellarExplorerLink type="tx" id={fullHash} truncate={false} />
    );
    
    expect(screen.getByText(fullHash)).toBeInTheDocument();
  });
});
