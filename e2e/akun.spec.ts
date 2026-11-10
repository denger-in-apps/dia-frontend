import { test, expect } from '@playwright/test';

test.describe('SCRUM-212 - Pengelolaan Akun Mahasiswa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/akun');
  });

  test('E2E-001: Halaman akun dapat dibuka', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Akun & privasi' })
    ).toBeVisible();
  });

  test('E2E-002: Informasi profil mahasiswa ditampilkan', async ({ page }) => {
    await expect(page.getByText('Muhammad Josfi')).toBeVisible();
    await expect(page.getByText('102062400003')).toBeVisible();
    await expect(page.getByText('081298765432')).toBeVisible();
  });

  test('E2E-003: Mode ubah profil dapat dibuka', async ({ page }) => {
    await page.getByRole('button', { name: 'Ubah profil' }).click();

    await expect(page.getByText('Mode ubah')).toBeVisible();
    await expect(page.locator('#nama')).toBeVisible();
    await expect(page.locator('#kontak')).toBeVisible();
    await expect(page.locator('#hubungan')).toBeVisible();
  });

  test('E2E-004: NIM tidak dapat diubah', async ({ page }) => {
    await page.getByRole('button', { name: 'Ubah profil' }).click();

    await expect(page.locator('#nama')).toBeVisible();
    await expect(page.getByText('102062400003')).toBeVisible();
    await expect(page.locator('input#nim')).toHaveCount(0);
  });

  test('E2E-005: Ekspor data menampilkan informasi prototipe', async ({ page }) => {
    await page.getByRole('button', { name: 'Ekspor data saya' }).click();

    await expect(page.getByRole('status')).toContainText(
      'Ekspor data belum tersedia'
    );
  });

  test('E2E-006: Penghapusan data tidak langsung dilakukan', async ({ page }) => {
    await page.getByRole('button', { name: 'Lihat opsi penghapusan' }).click();

    await expect(
      page.getByRole('dialog', { name: 'Penghapusan data' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Mengerti' }).click();

    await expect(page.getByRole('status')).toContainText(
      'Tidak ada data yang dihapus'
    );
  });
});
