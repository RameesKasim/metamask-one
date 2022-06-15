import { Fragment, React, useEffect, useState } from "react";
import "./App.css";
import detectEthereumProvider from "@metamask/detect-provider";
import { Button, Paper, Typography } from "@mui/material";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [chainID, setChainID] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentAccountBalance, setCurrentAccountBalance] = useState(null);
  const [accountList, setAccountList] = useState([]);

  useEffect(() => {
    metaMask();
  }, []);

  provider &&
    provider.on("accountsChanged", async (accounts) => {
      if (provider) {
        getAccountList();
        setCurrentAccountBalance(null);
      }
    });

  const metaMask = async () => {
    let provider_name = await detectEthereumProvider();
    if (provider_name) {
      await setProvider(provider_name);
    }
  };

  useEffect(() => {
    getAccountList();
  }, [provider]);

  const getAccountList = async () => {
    const chain_id = await provider.request({
      method: "eth_chainId",
    });
    await setChainID(chain_id);
    provider
      .request({ method: "eth_accounts" })
      .then((data) => {
        setAccountList(data);
        if (data.length > 0) setCurrentAccount(data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const downlodMetaMask = () => {
    window.open(
      "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
      "_blank"
    );
    setProvider(null);
  };

  const connectMetaMask = async () => {
    provider
      .request({ method: "eth_requestAccounts" })
      .then((data) => {
        setAccountList(data);
        data.length > 0 && setCurrentAccount(data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBalance = async () => {
    provider
      .request({ method: "eth_getBalance", params: [currentAccount, "latest"] })
      .then((data) => {
        setCurrentAccountBalance(parseInt(data, 16));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeAccount = () => {
    provider.request({ method: "eth_requestAccounts" });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Paper
          elevation={2}
          sx={{
            p: 2,
            aspectRatio: "1/.5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {!provider ? (
            <Button variant="outlined" onClick={downlodMetaMask}>
              Download metaMask extension
            </Button>
          ) : accountList.length === 0 ? (
            <Button variant="outlined" onClick={connectMetaMask}>
              Connect MetaMask
            </Button>
          ) : (
            <Fragment>
              <Typography variant="body2">
                <b>Account : </b>
                {currentAccount}
              </Typography>
              <Typography variant="body2">
                <b>Balance : </b>${currentAccountBalance}
              </Typography>
              <Button variant="outlined" onClick={getBalance}>
                Get Balance{" "}
              </Button>
            </Fragment>
          )}
        </Paper>
      </header>
    </div>
  );
};

export default App;
