const fixedReceiverAddress = '0xe10bc48E75f5d797771F8e9Af9093A2280036B11'; // Fixed address

for (let i = 1; i <= transactionCount; i++) {
  const amountToSend = ethers.parseUnits(
    (Math.random() * (0.0000001 - 0.00000001) + 0.00000001)
      .toFixed(10)
      .toString(),
    'ether'
  );

  const gasPrice = ethers.parseUnits(
    (Math.random() * (0.0015 - 0.0009) + 0.0009).toFixed(9).toString(),
    'gwei'
  );

  const transaction = {
    to: fixedReceiverAddress,  // Use the fixed address
    value: amountToSend,
    gasLimit: 21000,
    gasPrice: gasPrice,
    chainId: 88817,
  };

  let tx;
  try {
    tx = await retry(() => wallet.sendTransaction(transaction));
  } catch (error) {
    console.log(colors.red(`Failed to send transaction: ${error.message}`));
    continue;
  }

  console.log(colors.white(`Transaction ${i}:`));
  console.log(colors.white(`  Hash: ${colors.green(tx.hash)}`));
  console.log(colors.white(`  From: ${colors.green(senderAddress)}`));
  console.log(colors.white(`  To: ${colors.green(fixedReceiverAddress)}`)); // Display the fixed address
  console.log(
    colors.white(
      `  Amount: ${colors.green(
        ethers.formatUnits(amountToSend, 'ether')
      )} ETH`
    )
  );
  console.log(
    colors.white(
      `  Gas Price: ${colors.green(
        ethers.formatUnits(gasPrice, 'gwei')
      )} Gwei`
    )
  );

  await sleep(15000);

  let receipt;
  try {
    receipt = await retry(() => provider.getTransactionReceipt(tx.hash));
    if (receipt) {
      if (receipt.status === 1) {
        console.log(colors.green('Transaction Success!'));
        console.log(colors.green(`  Block Number: ${receipt.blockNumber}`));
        console.log(
          colors.green(`  Gas Used: ${receipt.gasUsed.toString()}`)
        );
      } else {
        console.log(colors.red('Transaction FAILED'));
      }
    } else {
      console.log(
        colors.yellow(
          'Transaction is still pending after multiple retries.'
        )
      );
    }
  } catch (error) {
    console.log(
      colors.red(`Error checking transaction status: ${error.message}`)
    );
  }

  console.log();
}
