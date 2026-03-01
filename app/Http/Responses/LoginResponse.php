<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        if ($request->user()->is_admin) {
            return redirect('/admin/dashboard');
        }

        return redirect()->intended('/customer/dashboard');
    }
}
